import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Spinner } from "../ui/Spinner";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.email("Enter a valid email"),
  bio: z.string().max(180, "Keep it under 180 characters").optional(),
  newsletter: z.boolean(),
  push: z.boolean(),
  profilePrivate: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
  register: ReturnType<typeof useForm<ProfileFormValues>>["register"];
  name: keyof ProfileFormValues;
}> = ({ icon, title, description, register, name }) => (
  <label className="flex items-center justify-between rounded-xl border border-default bg-surface-raised px-4 py-3 cursor-pointer hover:bg-surface-muted transition-colors">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="font-medium text-primary text-sm">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </div>
    <input
      type="checkbox"
      className="h-5 w-5 rounded accent-travel-600"
      {...register(name)}
    />
  </label>
);

const SettingsPage: React.FC = () => {
  const { user, resetPassword, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    "profile"
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
      newsletter: true,
      push: true,
      profilePrivate: false,
    },
  });

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    const load = async () => {
      try {
        const settings = await loadUserSettings(user.uid);
        reset({
          fullName:
            settings?.displayName ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "",
          email: settings?.email || user.email || "",
          bio: settings?.bio ?? "",
          newsletter: settings?.newsletter ?? true,
          push: settings?.push ?? true,
          profilePrivate: settings?.profilePrivate ?? false,
        });
      } catch {
        toast.error("Failed to load settings.");
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      await saveUserSettings(user.uid, {
        displayName: values.fullName,
        email: values.email,
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
    try {
      await resetPassword(user.email);
      toast.success("Password reset email sent.");
    } catch {
      toast.error("Could not send password reset email.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.email || !auth.currentUser) return;
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    readOnly
                    {...register("email")}
                    className="pl-10 opacity-70"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
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
                register={register}
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
                  register={register}
                  name="push"
                />
                <ToggleRow
                  icon={<Send className="w-5 h-5 text-travel-600 dark:text-travel-400" />}
                  title="Email updates"
                  description="Occasional tips and deals."
                  register={register}
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
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" onClick={handleChangePassword}>
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

                {showDeleteConfirm && (
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
