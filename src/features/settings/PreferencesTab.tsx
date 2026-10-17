import { useEffect, useState } from "react";
import { ApiError, getProfile, patchProfile, type Meta } from "../../api/client";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Choice } from "../quiz/Controls";
import { ComfortStep, InterestsStep } from "../quiz/Steps";
import { DEFAULT_SEARCH, type Level, type Pace, type Tier } from "../search/searchState";

const PACES: { value: Pace; label: string }[] = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "packed", label: "Packed" },
];

export function PreferencesTab({ meta }: { meta: Meta }) {
  const [tier, setTier] = useState<Tier>("mid");
  const [pace, setPace] = useState<Pace>("balanced");
  const [interests, setInterests] = useState<Record<string, Level>>({});
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then(({ preferences }) => {
        if (cancelled) return;
        if (preferences.tier) setTier(preferences.tier);
        if (preferences.pace) setPace(preferences.pace);
        setInterests((preferences.interests ?? {}) as Record<string, Level>);
        setLoaded(true);
      })
      .catch(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await patchProfile({ preferences: { tier, pace, interests } });
      setMessage({ kind: "ok", text: "Preferences saved. The quiz will start from these." });
    } catch (failure) {
      setMessage({ kind: "error", text: failure instanceof ApiError ? failure.message : "Couldn't save your preferences. Try again." });
    } finally {
      setBusy(false);
    }
  };

  const state = { ...DEFAULT_SEARCH, tier, pace, interests };
  const update = (patch: Partial<typeof state>) => {
    if (patch.tier) setTier(patch.tier);
    if (patch.interests) setInterests(patch.interests);
  };

  return (
    <Card className="max-w-2xl p-6 sm:p-8">
      <h3 className="m-0 text-lg font-bold text-ink">Trip preferences</h3>
      <p className="mb-0 mt-1 text-muted">We'll use these to pre-fill the trip quiz. You can still change any answer each time.</p>

      <section className="mt-8" aria-labelledby="pref-comfort">
        <h4 id="pref-comfort" className="m-0 mb-3 text-base font-bold text-ink">Usual comfort level</h4>
        <ComfortStep state={state} update={update} meta={meta} />
      </section>
      <section className="mt-8" aria-labelledby="pref-pace">
        <h4 id="pref-pace" className="m-0 mb-3 text-base font-bold text-ink">Usual pace</h4>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="pref-pace">
          {PACES.map((p) => (
            <Choice key={p.value} selected={pace === p.value} onSelect={() => setPace(p.value)}>
              {p.label}
            </Choice>
          ))}
        </div>
      </section>
      <section className="mt-8" aria-labelledby="pref-interests">
        <h4 id="pref-interests" className="m-0 mb-3 text-base font-bold text-ink">Things you usually enjoy</h4>
        <InterestsStep state={state} update={update} meta={meta} />
      </section>

      {message && (
        <p role={message.kind === "error" ? "alert" : "status"} className={`mb-0 mt-6 rounded-xl px-4 py-3 text-sm ${message.kind === "error" ? "bg-danger-wash text-danger" : "bg-primary-wash text-ink"}`}>
          {message.text}
        </p>
      )}
      <Button onClick={() => void save()} disabled={busy || !loaded} className="mt-6">
        {busy ? "Saving…" : "Save preferences"}
      </Button>
    </Card>
  );
}
