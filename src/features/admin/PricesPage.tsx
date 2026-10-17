import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, adminAddPrice, adminCoverage, adminList, adminPublish, type AdminDestination, type CoverageRow, type PublishResult } from "../../api/client";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { EmptyState } from "../../ui/EmptyState";
import { Field } from "../../ui/Field";
import { PageIntro } from "../../ui/PageIntro";
import { Select } from "../../ui/Select";
import { Skeleton } from "../../ui/Skeleton";
import { Check } from "lucide-react";

const TIERS = [
  { value: "budget", label: "Budget" },
  { value: "mid", label: "Mid-range" },
  { value: "premium", label: "Premium" },
] as const;

const TRIGGER = "rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-primary data-[state=active]:text-white";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function RateForm({ preset }: { preset: { id: string; name: string; tier?: string } | null }) {
  const [query, setQuery] = useState(preset?.name ?? "");
  const [results, setResults] = useState<AdminDestination[]>([]);
  const [chosen, setChosen] = useState<{ id: string; name: string } | null>(preset ? { id: preset.id, name: preset.name } : null);
  const [tier, setTier] = useState<(typeof TIERS)[number]["value"]>((preset?.tier as never) ?? "mid");
  const [subject, setSubject] = useState("");
  const [amount, setAmount] = useState("");
  const [observedOn, setObservedOn] = useState(today());
  const [sourceUrl, setSourceUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (chosen || query.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      adminList({ status: "published", q: query, pageSize: 6 })
        .then((page) => !cancelled && setResults(page.items))
        .catch(() => undefined);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, chosen]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const problems: string[] = [];
    if (!chosen) problems.push("Choose a published place.");
    if (!subject.trim()) problems.push("Name the hotel or venue.");
    if (!(Number(amount) > 0)) problems.push("Enter the nightly rate in naira.");
    if (!/^https?:\/\//.test(sourceUrl.trim())) problems.push("Paste the web page you read the rate from.");
    if (problems.length) {
      setMessage({ kind: "error", text: problems.join(" ") });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await adminAddPrice({
        component: "accommodation", tier, unit: "per_night", destination_id: chosen!.id,
        subject: subject.trim(), amount: Number(amount), observed_on: observedOn, source_url: sourceUrl.trim(), source_kind: "official_site",
      });
      setMessage({ kind: "ok", text: `Recorded ${subject.trim()} at ₦${Number(amount).toLocaleString("en-NG")} a night. Add another rate for the same place if you have one.` });
      setSubject("");
      setAmount("");
    } catch (failure) {
      setMessage({ kind: "error", text: failure instanceof ApiError ? failure.message : "Couldn't record that rate. Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="max-w-2xl p-6 sm:p-8">
      <h3 className="m-0 text-lg font-bold text-ink">Record a verified nightly rate</h3>
      <p className="mb-0 mt-1 text-muted">Read from the venue's own page. Every rate keeps its source link and date.</p>
      <form onSubmit={(e) => void submit(e)} className="mt-6 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <Field
            label="Place"
            value={chosen ? chosen.name : query}
            onChange={(e) => {
              setChosen(null);
              setQuery(e.target.value);
            }}
            placeholder="Search published places"
            autoComplete="off"
          />
          {results.length > 0 && (
            <ul className="m-0 list-none overflow-hidden rounded-xl border border-line bg-surface p-0">
              {results.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => { setChosen({ id: r.id, name: r.name }); setResults([]); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-line">
                    <span className="font-semibold text-ink">{r.name}</span> <span className="text-muted">{r.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Kind of stay</span>
          <Select label="Kind of stay" value={tier} onChange={(e) => setTier(e.target.value as typeof tier)}>
            {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </div>
        <Field label="Hotel or venue name" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rate per night (₦)" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} />
          <Field label="Date you checked it" type="date" value={observedOn} max={today()} onChange={(e) => setObservedOn(e.target.value)} />
        </div>
        <Field label="Source page" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://" />
        {message && (
          <p role={message.kind === "error" ? "alert" : "status"} className={`m-0 rounded-xl px-4 py-3 text-sm ${message.kind === "error" ? "bg-danger-wash text-danger" : "bg-primary-wash text-ink"}`}>
            {message.text}
          </p>
        )}
        <Button type="submit" disabled={busy} className="self-start">{busy ? "Recording…" : "Record rate"}</Button>
      </form>
    </Card>
  );
}

function Coverage({ onRecord }: { onRecord: (row: CoverageRow, tier: string) => void }) {
  const [rows, setRows] = useState<CoverageRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    adminCoverage()
      .then((found) => !cancelled && setRows(found))
      .catch((failure: unknown) => !cancelled && setError(failure instanceof ApiError ? failure.message : "Couldn't load coverage."));
    return () => {
      cancelled = true;
    };
  }, []);
  if (error) return <p role="alert" className="rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">{error}</p>;
  if (!rows) return <Skeleton className="h-48" />;
  if (rows.length === 0) return <EmptyState Icon={Check} title="Every published place has rates" body="Stays can be priced for all of them." />;
  return (
    <div>
      <p className="mb-4 mt-0 text-muted">{rows.length} published places can't be priced for overnight trips yet. Record a rate for each missing kind of stay.</p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
            <div>
              <p className="m-0 font-semibold text-ink">{row.name}</p>
              <p className="m-0 text-sm text-muted">{row.state}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {row.missing_tiers.map((tier) => (
                <Button key={tier} size="sm" variant="secondary" onClick={() => onRecord(row, tier)}>
                  Add {tier}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Publish() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      setResult(await adminPublish());
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : "Couldn't publish. Try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card className="max-w-2xl p-6 sm:p-8">
      <h3 className="m-0 text-lg font-bold text-ink">Publish the catalog</h3>
      <p className="mb-0 mt-1 text-muted">
        Makes every approved place and every recorded price live. Running servers pick the new version up within a minute.
      </p>
      {error && <p role="alert" className="mb-0 mt-5 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">{error}</p>}
      {result && (
        <p role="status" className="mb-0 mt-5 rounded-xl bg-primary-wash px-4 py-3 text-sm text-ink">
          Published catalog version {result.catalog_version} with {result.destination_count} places.
        </p>
      )}
      <Button onClick={() => void run()} disabled={busy} className="mt-6">{busy ? "Publishing…" : "Publish now"}</Button>
    </Card>
  );
}

export function PricesPage() {
  const [tab, setTab] = useState("record");
  const [preset, setPreset] = useState<{ id: string; name: string; tier?: string } | null>(null);
  return (
    <div>
      <PageIntro title="Prices">Record verified rates, see which places still need them, and publish.</PageIntro>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List aria-label="Price tools" className="mb-8 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
          <Tabs.Trigger value="record" className={TRIGGER}>Record a rate</Tabs.Trigger>
          <Tabs.Trigger value="coverage" className={TRIGGER}>Coverage</Tabs.Trigger>
          <Tabs.Trigger value="publish" className={TRIGGER}>Publish</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="record" className="outline-none"><RateForm key={preset?.id + String(preset?.tier)} preset={preset} /></Tabs.Content>
        <Tabs.Content value="coverage" className="outline-none">
          <Coverage onRecord={(row, tier) => { setPreset({ id: row.id, name: row.name, tier }); setTab("record"); }} />
        </Tabs.Content>
        <Tabs.Content value="publish" className="outline-none"><Publish /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
