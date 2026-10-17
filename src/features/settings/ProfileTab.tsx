import { updateProfile } from "firebase/auth";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, getProfile, patchProfile, type Meta } from "../../api/client";
import { auth } from "../../firebase/firebase";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Field } from "../../ui/Field";
import { Select } from "../../ui/Select";
import { useAuth } from "../auth/authContext";

export function ProfileTab({ meta }: { meta: Meta }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [home, setHome] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (cancelled) return;
        setName(profile.display_name ?? user?.displayName ?? "");
        setHome(profile.home_state ?? "");
        setLoaded(true);
      })
      .catch(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setMessage({ kind: "error", text: "Enter a name to save." });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await patchProfile({ display_name: name.trim(), ...(home ? { home_state: home } : { clear_home_state: true }) });
      if (auth.currentUser && auth.currentUser.displayName !== name.trim()) {
        await updateProfile(auth.currentUser, { displayName: name.trim() }).catch(() => undefined);
      }
      setMessage({ kind: "ok", text: "Profile saved." });
    } catch (failure) {
      setMessage({ kind: "error", text: failure instanceof ApiError ? failure.message : "Couldn't save your profile. Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="max-w-xl p-6 sm:p-8">
      <h3 className="m-0 text-lg font-bold text-ink">Profile</h3>
      <form onSubmit={(e) => void submit(e)} className="mt-6 flex flex-col gap-5" noValidate>
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" disabled={!loaded} maxLength={80} />
        <Field label="Email" value={user?.email ?? "Guest account"} readOnly disabled hint="Your sign-in email can't be changed here." />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Home state</span>
          <Select label="Home state" value={home} onChange={(e) => setHome(e.target.value)} disabled={!loaded}>
            <option value="">Not set</option>
            {meta.states.map((s) => (
              <option key={s.iso} value={s.iso}>
                {s.name}
              </option>
            ))}
          </Select>
          <p className="m-0 text-[13px] text-muted">We'll start your trip quiz from here.</p>
        </div>
        {message && (
          <p role={message.kind === "error" ? "alert" : "status"} className={`m-0 rounded-xl px-4 py-3 text-sm ${message.kind === "error" ? "bg-danger-wash text-danger" : "bg-primary-wash text-ink"}`}>
            {message.text}
          </p>
        )}
        <Button type="submit" disabled={busy || !loaded} className="self-start">
          {busy ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </Card>
  );
}
