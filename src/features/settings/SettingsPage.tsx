import * as Tabs from "@radix-ui/react-tabs";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { useMeta } from "../search/useMeta";
import { PageIntro } from "../../ui/PageIntro";
import { Skeleton } from "../../ui/Skeleton";
import { AppearanceTab } from "./AppearanceTab";
import { PreferencesTab } from "./PreferencesTab";
import { PrivacyTab } from "./PrivacyTab";
import { ProfileTab } from "./ProfileTab";

const TRIGGER =
  "rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-primary data-[state=active]:text-white";

export function SettingsPage() {
  const { user, isSignedIn } = useAuth();
  const meta = useMeta();
  const needsSession = !user;

  return (
    <div>
      <PageIntro title="Settings">Your profile, trip preferences and how Travely looks.</PageIntro>
      <Tabs.Root defaultValue={needsSession ? "appearance" : "profile"}>
        <Tabs.List aria-label="Settings sections" className="mb-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1">
          <Tabs.Trigger value="profile" className={TRIGGER} disabled={needsSession}>Profile</Tabs.Trigger>
          <Tabs.Trigger value="preferences" className={TRIGGER} disabled={needsSession}>Preferences</Tabs.Trigger>
          <Tabs.Trigger value="appearance" className={TRIGGER}>Appearance</Tabs.Trigger>
          <Tabs.Trigger value="privacy" className={TRIGGER} disabled={needsSession}>Privacy and data</Tabs.Trigger>
        </Tabs.List>

        {!isSignedIn && (
          <p className="mb-6 mt-0 max-w-prose text-sm text-muted">
            {needsSession ? "Plan a trip or sign in to manage your profile and data." : "You're using a guest account."}{" "}
            <Link to="/signup?next=/app/settings" className="font-semibold text-primary">
              Create an account
            </Link>{" "}
            to keep it on every device.
          </p>
        )}

        <Tabs.Content value="profile" className="outline-none">
          {meta.status === "ready" ? <ProfileTab meta={meta.meta} /> : <Skeleton className="h-72 max-w-xl" />}
        </Tabs.Content>
        <Tabs.Content value="preferences" className="outline-none">
          {meta.status === "ready" ? <PreferencesTab meta={meta.meta} /> : <Skeleton className="h-72 max-w-2xl" />}
        </Tabs.Content>
        <Tabs.Content value="appearance" className="outline-none">
          <AppearanceTab />
        </Tabs.Content>
        <Tabs.Content value="privacy" className="outline-none">
          <PrivacyTab />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
