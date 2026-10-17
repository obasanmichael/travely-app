import * as Dialog from "@radix-ui/react-dialog";
import { Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, deleteMyAccount, downloadMyData, getProfile, patchProfile } from "../../api/client";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Field } from "../../ui/Field";
import { Switch } from "../../ui/Switch";
import { useAuth } from "../auth/authContext";

export function PrivacyTab() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (cancelled) return;
        setAnalytics(profile.analytics_consent);
        setMarketing(profile.marketing_consent);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const describe = (failure: unknown, fallback: string) => (failure instanceof ApiError ? failure.message : fallback);

  const toggle = async (key: "analytics_consent" | "marketing_consent", value: boolean) => {
    const previous = key === "analytics_consent" ? analytics : marketing;
    (key === "analytics_consent" ? setAnalytics : setMarketing)(value);
    setError(null);
    try {
      await patchProfile({ [key]: value });
    } catch (failure) {
      (key === "analytics_consent" ? setAnalytics : setMarketing)(previous);
      setError(describe(failure, "Couldn't save that choice. Try again."));
    }
  };

  const download = async () => {
    setExporting(true);
    setError(null);
    try {
      await downloadMyData();
    } catch (failure) {
      setError(describe(failure, "Couldn't prepare your data. Try again."));
    } finally {
      setExporting(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteMyAccount();
      await signOut().catch(() => undefined);
      navigate("/", { replace: true });
    } catch (failure) {
      setOpen(false);
      setError(describe(failure, "Couldn't delete your account. Try again."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {error && (
        <p role="alert" className="m-0 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      <Card className="p-6 sm:p-8">
        <h3 className="m-0 text-lg font-bold text-ink">Your choices</h3>
        <div className="mt-5 flex flex-col divide-y divide-line">
          <label className="flex items-center justify-between gap-6 py-4 first:pt-0">
            <span>
              <span className="block font-semibold text-ink">Help us improve Travely</span>
              <span className="block text-sm text-muted">Share anonymous usage, like which places get saved. Never your answers or name.</span>
            </span>
            <Switch checked={analytics} onCheckedChange={(v) => void toggle("analytics_consent", v)} label="Share anonymous usage" />
          </label>
          <label className="flex items-center justify-between gap-6 py-4 last:pb-0">
            <span>
              <span className="block font-semibold text-ink">Product updates by email</span>
              <span className="block text-sm text-muted">Occasional news about new places and features.</span>
            </span>
            <Switch checked={marketing} onCheckedChange={(v) => void toggle("marketing_consent", v)} label="Product updates by email" />
          </label>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h3 className="m-0 text-lg font-bold text-ink">Your data</h3>
        <p className="mb-0 mt-1 text-muted">Download everything we store about you: your profile, saved places and every trip.</p>
        <Button variant="secondary" onClick={() => void download()} disabled={exporting} className="mt-5">
          <Download className="h-4 w-4" aria-hidden="true" /> {exporting ? "Preparing…" : "Download my data"}
        </Button>
      </Card>

      <Card className="border-danger/40 p-6 sm:p-8">
        <h3 className="m-0 text-lg font-bold text-danger">Delete account</h3>
        <p className="mb-0 mt-1 text-muted">Permanently removes your account, saved places and trips. This can't be undone.</p>
        <Dialog.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) setConfirm(""); }}>
          <Dialog.Trigger asChild>
            <Button variant="danger" className="mt-5">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete my account
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-night/60 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface p-7 shadow-lift outline-none">
              <Dialog.Title className="m-0 text-xl font-bold text-ink">Delete your account?</Dialog.Title>
              <Dialog.Description className="mb-5 mt-2 text-muted">
                Your profile, saved places and all trips will be deleted for good. Type <strong className="text-ink">delete</strong> to confirm.
              </Dialog.Description>
              <Field label="Type delete" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
              <div className="mt-6 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Button variant="danger" disabled={confirm.trim().toLowerCase() !== "delete" || deleting} onClick={() => void remove()}>
                  {deleting ? "Deleting…" : "Delete account"}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Card>
    </div>
  );
}
