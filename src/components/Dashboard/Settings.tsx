import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  User2,
  Quote,
  Shield,
  Bell,
  Send,
  Trash2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card, CardHeader } from "../ui/Card";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/firebase";
import {
  deleteAccountData,
  loadUserSettings,
  saveUserSettings,
} from "../../services/userService";
import type { UserSettings } from "../types/types";
import { Spinner } from "../ui/Spinner";
import type { User } from "firebase/auth";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  bio: z.string().max(180, "Keep it under 180 characters").optional(),
  newsletter: z.boolean(),
  push: z.boolean(),
  profilePrivate: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function buildProfileFormValues(
  user: User,
  settings: UserSettings | null
): ProfileFormValues {
  return {
    fullName:
      settings?.displayName ||
      user.displayName ||
      user.email?.split("@")[0] ||
      "",
    bio: settings?.bio ?? "",
    newsletter: settings?.newsletter ?? true,
    push: settings?.push ?? true,
    profilePrivate: settings?.profilePrivate ?? false,
  };
}

const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-secondary mb-1.5"
  >
    {children}
  </label>
);

const inputClasses =
  "w-full rounded-xl border border-default bg-surface-raised text-primary px-4 py-3 shadow-sm outline-none transition focus:border-travel-500 focus:ring-4 focus:ring-travel-500/10 placeholder:text-muted";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`${inputClasses} ${className}`} {...props} />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea ref={ref} className={`${inputClasses} ${className}`} {...props} />
));
Textarea.displayName = "Textarea";

const SettingsCard: React.FC<{
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, className = "", children }) => (
  <Card className={className} padding="none">
    <div className="p-5 border-b border-default">
      <CardHeader title={title} description={description} />
    </div>
    <div className="p-5">{children}</div>
  </Card>
);

const ToggleRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  control: ReturnType<typeof useForm<ProfileFormValues>>["control"];
  name: "newsletter" | "push" | "profilePrivate";
}> = ({ icon, title, description, control, name }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange, ref, onBlur } }) => (
      <label className="flex items-center justify-between rounded-xl border border-default bg-surface-raised px-4 py-3 cursor-pointer hover:bg-surface-muted transition-colors">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="font-medium text-primary text-sm">{title}</p>
            <p className="text-xs text-muted">{description}</p>
          </div>
        </div>
        <input
          ref={ref}
          type="checkbox"
          className="h-5 w-5 rounded accent-travel-600"
          checked={Boolean(value)}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.checked)}
        />
      </label>
    )}
  />
);

const SettingsPage: React.FC = () => {
  const { user, resetPassword, sendVerificationEmail, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    "profile"
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const hasPasswordProvider = Boolean(
    user?.providerData?.some((provider) => provider.providerId === "password")
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      newsletter: true,
      push: true,
      profilePrivate: false,
    },
  });

  useEffect(() => {
    if (!user?.uid) {
      setPageLoading(false);
      return;
    }

    let cancelled = false;
    const uid = user.uid;

    const load = async () => {
      const authUser = auth.currentUser;
      if (!authUser) {
        if (!cancelled) setPageLoading(false);
        return;
      }

      try {
        const settings = await loadUserSettings(uid);
        if (cancelled) return;
        reset(buildProfileFormValues(authUser, settings));
      } catch (err) {
        console.error("Failed to load settings:", err);
        if (cancelled) return;
        reset(buildProfileFormValues(authUser, null));
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      await saveUserSettings(user.uid, {
        displayName: values.fullName,
        bio: values.bio,
        newsletter: values.newsletter,
        push: values.push,
        profilePrivate: values.profilePrivate,
      });

      if (auth.currentUser && values.fullName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: values.fullName });
      }

      await refreshUser();
      toast.success("Changes saved successfully");
      reset(values);
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      toast.error("No email on file for this account.");
      return;
    }
    if (!hasPasswordProvider) {
      toast.error("This account uses a social sign-in provider. Change your password with that provider.");
      return;
    }
    try {
      await resetPassword(user.email);
      toast.success("Password reset email sent.");
    } catch {
      toast.error("Could not send password reset email.");
    }
  };

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerificationEmail();
      toast.success("Verification email sent.");
    } catch {
      toast.error("Could not send verification email.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.email || !auth.currentUser) return;
    if (!hasPasswordProvider) {
      toast.error("Account deletion for social sign-in is not supported yet.");
      return;
    }
    if (!deletePassword) {
      toast.error("Enter your password to confirm deletion.");
      return;
    }

    setIsDeleting(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteAccountData(user.uid);
      await deleteUser(auth.currentUser);
      toast.success("Account deleted.");
      navigate("/");
    } catch (error: unknown) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";
      if (code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error("Could not delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const tabClass = (tab: typeof activeTab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      activeTab === tab
        ? "bg-travel-600 text-white shadow-sm dark:bg-travel-500"
        : "bg-surface-raised border border-default text-secondary hover:bg-surface-muted hover:text-primary"
    }`;

  const accountEmail = auth.currentUser?.email ?? user?.email ?? "";
  const displayName = watch("fullName") || user?.displayName || "Traveler";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Settings & Profile
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your personal info, appearance, and notifications.
          </p>
        </div>
        <Button
          type="submit"
          form="settings-form"
          disabled={isSubmitting || !isDirty}
          size="md"
        >
          <Save className="w-4 h-4" />
          Save changes
        </Button>
      </div>

      <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Appearance</p>
          <p className="text-xs text-muted">Switch between light and dark mode</p>
        </div>
        <ThemeToggle compact />
      </Card>

      <div className="flex gap-2">
        <button type="button" onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={tabClass("preferences")}
        >
          Preferences
        </button>
      </div>

      <form
        id="settings-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {activeTab === "profile" && (
          <SettingsCard
            title="Basic info"
            description="Keep your details up to date."
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-default">
              <div className="h-14 w-14 rounded-full bg-travel-100 dark:bg-travel-900/40 flex items-center justify-center text-lg font-semibold text-travel-700 dark:text-travel-300">
                {initials || "T"}
              </div>
              <div>
                <p className="font-medium text-primary">{displayName}</p>
                <p className="text-sm text-secondary">{user?.email}</p>
                <p className="text-xs text-muted mt-0.5">
                  {user?.emailVerified ? "Email verified" : "Email not verified"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <div className="relative">
                  <User2 className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                  <Input
                    id="fullName"
                    placeholder="Ada Lovelace"
                    {...register("fullName")}
                    className="pl-10"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="account-email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                  <div
                    id="account-email"
                    aria-readonly="true"
                    className={`${inputClasses} pl-10 opacity-70 cursor-not-allowed select-all`}
                  >
                    {accountEmail || "No email on file"}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  Your sign-in email is tied to your account and cannot be
                  changed here.
                </p>
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <div className="relative">
                  <Quote className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="A line about you…"
                    {...register("bio")}
                    className="pl-10"
                  />
                </div>
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </div>
          </SettingsCard>
        )}

        {activeTab === "preferences" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SettingsCard
              title="Privacy"
              description="Control how your profile appears."
              className="lg:col-span-1"
            >
              <ToggleRow
                icon={<Shield className="w-5 h-5 text-travel-600 dark:text-travel-400" />}
                title="Private profile"
                description="Hide your profile from public pages."
                control={control}
                name="profilePrivate"
              />
            </SettingsCard>

            <SettingsCard
              title="Notifications"
              description="Choose how we keep in touch."
              className="lg:col-span-2"
            >
              <div className="space-y-3">
                <ToggleRow
                  icon={<Bell className="w-5 h-5 text-travel-600 dark:text-travel-400" />}
                  title="Push notifications"
                  description="Recommendations & updates on the go."
                  control={control}
                  name="push"
                />
                <ToggleRow
                  icon={<Send className="w-5 h-5 text-travel-600 dark:text-travel-400" />}
                  title="Email updates"
                  description="Occasional tips and deals."
                  control={control}
                  name="newsletter"
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title="Account"
              description="Security & critical actions."
              className="lg:col-span-3"
            >
              <div className="space-y-4">
                {!user?.emailVerified && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-secondary">
                      Verify your email to help secure your account.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isSendingVerification}
                      onClick={handleResendVerification}
                    >
                      {isSendingVerification ? "Sending…" : "Resend verification"}
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleChangePassword}
                    disabled={!hasPasswordProvider}
                  >
                    Change password
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowDeleteConfirm((v) => !v)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete account
                  </Button>
                </div>

                {showDeleteConfirm && hasPasswordProvider && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 space-y-3">
                    <p className="text-sm text-secondary">
                      This permanently deletes your profile, preferences, and
                      recommendation history. Enter your password to confirm.
                    </p>
                    <Input
                      type="password"
                      placeholder="Your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="danger"
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                      >
                        {isDeleting ? "Deleting…" : "Confirm delete"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SettingsCard>
          </div>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;
