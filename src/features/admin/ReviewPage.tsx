import { Check, ImageOff, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ApiError, adminList, adminReview, type AdminDestination, type Meta } from "../../api/client";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Drawer } from "../../ui/Drawer";
import { EmptyState } from "../../ui/EmptyState";
import { Field } from "../../ui/Field";
import { PageIntro } from "../../ui/PageIntro";
import { Select } from "../../ui/Select";
import { Skeleton } from "../../ui/Skeleton";
import { useMeta } from "../search/useMeta";

type Status = "candidate" | "published" | "rejected";
const PAGE = 20;

interface Tag {
  slug: string;
  weight: number;
}

function Editor({ place, meta, onDone, onClose }: { place: AdminDestination; meta: Meta; onDone: (id: string, status: string) => void; onClose: () => void }) {
  const [name, setName] = useState(place.name);
  const [description, setDescription] = useState(place.description ?? "");
  const [notes, setNotes] = useState(place.access_notes ?? "");
  const [lat, setLat] = useState(String(place.latitude));
  const [lon, setLon] = useState(String(place.longitude));
  const [tags, setTags] = useState<Tag[]>(place.tags.map((t) => ({ slug: t.slug, weight: t.weight })));
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labels = new Map([...meta.interests.map((i) => [i.slug, i.label] as const), ["family-friendly", "Family-friendly"] as const]);
  const addable = [...labels.keys()].filter((slug) => !tags.some((t) => t.slug === slug));

  const changes = () => {
    const out: Record<string, unknown> = {};
    if (name.trim() !== place.name) out.name = name.trim();
    if (description !== (place.description ?? "")) out.description = description;
    if (notes !== (place.access_notes ?? "")) out.access_notes = notes;
    if (Number(lat) !== place.latitude || Number(lon) !== place.longitude) {
      out.latitude = Number(lat);
      out.longitude = Number(lon);
    }
    if (JSON.stringify(tags) !== JSON.stringify(place.tags.map((t) => ({ slug: t.slug, weight: t.weight })))) out.tags = tags;
    return out;
  };

  const act = async (action: "approve" | "fix" | "reject") => {
    setBusy(true);
    setError(null);
    try {
      const edits = action === "reject" ? {} : changes();
      const result = await adminReview(place.id, {
        action,
        note: note.trim() || undefined,
        ...(Object.keys(edits).length ? { changes: edits as never } : {}),
      });
      onDone(place.id, result.status);
      onClose();
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : "Couldn't save that decision. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {place.photo_url ? (
        <figure className="m-0">
          <img src={place.photo_url} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" />
          <figcaption className="mt-1 text-[12px] text-muted">{place.photo_credit}</figcaption>
        </figure>
      ) : (
        <p className="m-0 flex items-center gap-2 rounded-xl bg-line px-4 py-3 text-sm text-muted">
          <ImageOff className="h-4 w-4" aria-hidden="true" /> No photo yet
        </p>
      )}
      <div className="flex flex-wrap gap-3 text-sm">
        {place.wikipedia_url && <a href={place.wikipedia_url} target="_blank" rel="noreferrer" className="font-semibold text-primary">Wikipedia</a>}
        {place.wikidata_id && <a href={`https://www.wikidata.org/wiki/${place.wikidata_id}`} target="_blank" rel="noreferrer" className="font-semibold text-primary">Wikidata</a>}
        <a href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`} target="_blank" rel="noreferrer" className="font-semibold text-primary">Check the pin on a map</a>
      </div>

      <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={2000} className="rounded-xl border border-line bg-surface p-3 text-base font-normal text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Getting there and access notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={1000} className="rounded-xl border border-line bg-surface p-3 text-base font-normal text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude" inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} />
        <Field label="Longitude" inputMode="decimal" value={lon} onChange={(e) => setLon(e.target.value)} />
      </div>

      <section aria-labelledby="tags-title">
        <h3 id="tags-title" className="m-0 mb-3 text-base font-bold text-ink">What it offers</h3>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {tags.map((tag) => (
            <li key={tag.slug} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-sm font-semibold text-ink">{labels.get(tag.slug) ?? tag.slug}</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={tag.weight}
                aria-label={`${labels.get(tag.slug) ?? tag.slug} weight`}
                onChange={(e) => setTags((current) => current.map((t) => (t.slug === tag.slug ? { ...t, weight: Number(e.target.value) } : t)))}
                className="flex-1 accent-[var(--c-primary)]"
              />
              <span className="w-8 text-right text-sm tabular-nums text-muted">{tag.weight.toFixed(1)}</span>
              <button type="button" aria-label={`Remove ${labels.get(tag.slug) ?? tag.slug}`} onClick={() => setTags((current) => current.filter((t) => t.slug !== tag.slug))} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-line hover:text-ink">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        {tags.length < 12 && (
          <div className="mt-3">
            <Select label="Add something it offers" value="" onChange={(e) => e.target.value && setTags((current) => [...current, { slug: e.target.value, weight: 0.7 }])}>
              <option value="">Add something it offers…</option>
              {addable.map((slug) => <option key={slug} value={slug}>{labels.get(slug)}</option>)}
            </Select>
          </div>
        )}
      </section>

      <Field label="Note for the record" hint="Optional. Why you approved, fixed or rejected it." value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
      {error && <p role="alert" className="m-0 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">{error}</p>}
      <div className="sticky bottom-0 -mx-6 flex flex-wrap gap-3 border-t border-line bg-surface/95 px-6 py-4 backdrop-blur">
        <Button onClick={() => void act("approve")} disabled={busy}><Check className="h-4 w-4" aria-hidden="true" /> Approve and publish</Button>
        <Button variant="secondary" onClick={() => void act("fix")} disabled={busy}><Wrench className="h-4 w-4" aria-hidden="true" /> Save changes</Button>
        <Button variant="danger" onClick={() => void act("reject")} disabled={busy}>Reject</Button>
        {place.status === "published" && (
          <Button variant="ghost" onClick={() => void unpublish()} disabled={busy}>Unpublish</Button>
        )}
      </div>
    </div>
  );

  async function unpublish() {
    setBusy(true);
    try {
      const result = await adminReview(place.id, { action: "unpublish", note: note.trim() || undefined });
      onDone(place.id, result.status);
      onClose();
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : "Couldn't unpublish. Try again.");
    } finally {
      setBusy(false);
    }
  }
}

export function ReviewPage() {
  const meta = useMeta();
  const [status, setStatus] = useState<Status>("candidate");
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminDestination[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<AdminDestination | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminList({ status, state, q: query, page, pageSize: PAGE })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setTotal(result.total);
      })
      .catch((failure: unknown) => !cancelled && setError(failure instanceof ApiError ? failure.message : "Couldn't load the queue. Try again."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [status, state, query, page]);

  useEffect(() => load(), [load]);
  useEffect(() => setPage(1), [status, state, query]);

  const decided = (id: string) => {
    // The decided place leaves this list straight away; the count follows.
    setItems((current) => current.filter((p) => p.id !== id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <div>
      <PageIntro title="Review places">Check each candidate's name, map pin, tags and photo. Only places you approve reach users.</PageIntro>
      <div className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <Field label="Search by name" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Status</span>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="candidate">Needs review</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">State</span>
          <Select label="State" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Any state</option>
            {meta.status === "ready" && meta.meta.states.map((s) => <option key={s.iso} value={s.iso}>{s.name}</option>)}
          </Select>
        </div>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">{error}</p>}
      {loading && <div aria-busy="true" className="flex flex-col gap-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>}
      {!loading && !error && items.length === 0 && (
        <EmptyState Icon={Check} title={status === "candidate" ? "Nothing left to review" : "Nothing here"} body={status === "candidate" ? "Every candidate that matches has been decided. Publish the catalog when you're ready." : "No places match these filters."} />
      )}
      {!loading && items.length > 0 && (
        <>
          <p className="mb-3 mt-0 text-sm text-muted" aria-live="polite">{total.toLocaleString("en-NG")} places</p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {items.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => setOpen(place)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-line bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-wash">
                    {place.photo_url ? <img src={place.photo_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageOff className="h-5 w-5 text-muted" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{place.name}</span>
                    <span className="block truncate text-sm text-muted">{place.state}{place.description ? `. ${place.description}` : ""}</span>
                  </span>
                  <span className="hidden shrink-0 gap-2 sm:flex">
                    {place.wikipedia_url && <Badge tone="primary">Wikipedia</Badge>}
                    {!place.photo_url && <Badge tone="danger">No photo</Badge>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-muted">Page {page} of {pages}</span>
              <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      <Drawer open={open !== null} onOpenChange={(next) => !next && setOpen(null)} title={open?.name ?? "Place"} description={open?.state}>
        {open && meta.status === "ready" && <Editor key={open.id} place={open} meta={meta.meta} onDone={decided} onClose={() => setOpen(null)} />}
      </Drawer>
    </div>
  );
}
