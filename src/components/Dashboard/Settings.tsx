import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
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
import { Button } from "../ui/Button";
import { Card, CardHeader } from "../ui/Card";
import { ThemeToggle } from "../ui/ThemeToggle";

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

const AvatarUploader: React.FC<{
  value?: string | null;
  onChange: (dataUrl: string) => void;
}> = ({ value, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handlePick = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-28 h-28">
      <img
        src={
          preview ||
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&h=200&fit=crop&auto=format"
        }
        alt="Profile"
        className="w-28 h-28 rounded-2xl object-cover border border-default shadow-card"
      />
      <button
        type="button"
        onClick={handlePick}
        className="absolute -bottom-2 -right-2 inline-flex items-center justify-center rounded-xl bg-travel-600 text-white shadow-md hover:bg-travel-700 w-9 h-9 transition-colors"
        aria-label="Change profile photo"
      >
        <Camera className="w-4 h-4" />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

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
  const {
    register,
    handleSubmit,
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

  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    "profile"
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const onSubmit = async (values: ProfileFormValues) => {
    toast.success("Changes updated successfully");
    await new Promise((r) => setTimeout(r, 600));
    console.log("Save payload:", values);
  };

  const tabClass = (tab: typeof activeTab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      activeTab === tab
        ? "bg-travel-600 text-white shadow-sm dark:bg-travel-500"
        : "bg-surface-raised border border-default text-secondary hover:bg-surface-muted hover:text-primary"
    }`;

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SettingsCard
              title="Profile photo"
              description="Your avatar across Travely."
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-4">
                <AvatarUploader
                  value={avatarPreview}
                  onChange={(dataUrl) => {
                    setAvatarPreview(dataUrl);
                  }}
                />
                <p className="text-xs text-muted">PNG/JPG, up to 2MB. Square works best.</p>
              </div>
            </SettingsCard>

            <SettingsCard
              title="Basic info"
              description="Keep your details up to date."
              className="lg:col-span-2"
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
                      placeholder="you@example.com"
                      {...register("email")}
                      className="pl-10"
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
          </div>
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
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="secondary">
                  Change password
                </Button>
                <Button type="button" variant="danger">
                  <Trash2 className="w-4 h-4" />
                  Delete account
                </Button>
              </div>
            </SettingsCard>
          </div>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;
