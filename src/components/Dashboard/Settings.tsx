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

// ---------- Schema ----------
const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  bio: z.string().max(180, "Keep it under 180 characters").optional(),
  newsletter: z.boolean().default(true),
  push: z.boolean().default(true),
  profilePrivate: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ---------- Helper UI ----------
const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
  </label>
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={[
      "w-full rounded-xl border border-gray-200 bg-white px-4 py-3",
      "shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
      className,
    ].join(" ")}
    {...props}
  />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={[
      "w-full rounded-xl border border-gray-200 bg-white px-4 py-3",
      "shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
      className,
    ].join(" ")}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const Card: React.FC<{
  title: string;
  description?: string;
  right?: React.ReactNode;
  className: string;
  children: React.ReactNode;
}> = ({ title, description, right, className = "", children }) => (
  <section
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
  >
    <div className="flex items-start justify-between p-5 border-b border-gray-100">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {right}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

// ---------- Avatar Uploader ----------
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
        className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shadow"
      />
      <button
        type="button"
        onClick={handlePick}
        className="absolute -bottom-2 -right-2 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 w-9 h-9"
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

// ---------- Page ----------
const SettingsPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any, // Fix type mismatch for optional fields
  });

  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    "profile"
  );
  const avatar = watch("avatar" as any); // ignore TS for local-only avatar (not in schema)

  const onSubmit = async (values: ProfileFormValues) => {
    // TODO: wire Firebase here:
    // - If avatar changed: upload to Storage and get URL
    // - await updateProfile(auth.currentUser, { displayName: values.fullName, photoURL })
    // - If email changed: await updateEmail(auth.currentUser, values.email)
      // - Persist bio/privacy/notifications to Firestore (users/{uid})
      toast.success('changes updated successfully')
    await new Promise((r) => setTimeout(r, 600));
    // toast.success("Profile updated");
    console.log("Save payload:", values);
  };

  const headerActions = (
    <button
      type="submit"
      form="settings-form"
      disabled={isSubmitting || !isDirty}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white shadow-sm transition
        ${
          isSubmitting || !isDirty
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      <Save className="w-4 h-4" />
      Save Changes
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Sticky header on desktop */}
      <div className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 border-b border-gray-200 -mx-2 px-2">
        <div className="max-w-5xl mx-auto py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Settings & Profile
            </h1>
            <p className="text-sm text-gray-500">
              Manage your personal info, privacy and notifications.
            </p>
          </div>
          <div className="hidden md:block">{headerActions}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === "profile"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === "preferences"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Preferences
        </button>
      </div>

      <form
        id="settings-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card
              title="Profile Photo"
              description="Upload a clear photo—your avatar across Travely."
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-4">
                <AvatarUploader
                  value={avatar as any}
                  onChange={(dataUrl) => {
                    // local preview only; store in RHF to save later
                    setValue("avatar" as any, dataUrl, { shouldDirty: true });
                  }}
                />
                <div className="text-xs text-gray-500">
                  PNG/JPG, up to 2MB. Square works best.
                </div>
              </div>
            </Card>

            <Card
              title="Basic Info"
              description="Keep your details up to date."
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <div className="relative">
                    <User2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Ada Lovelace"
                      {...register("fullName")}
                      className="pl-10"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <div className="relative">
                    <Quote className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="bio"
                      rows={3}
                      placeholder="A line about you…"
                      {...register("bio")}
                      className="pl-10"
                    />
                  </div>
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bio.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card
              title="Privacy"
              description="Control how your profile appears."
              className="lg:col-span-1"
            >
              <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Private profile</p>
                    <p className="text-xs text-gray-500">
                      Hide your profile from public pages.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  {...register("profilePrivate")}
                />
              </label>
            </Card>

            <Card
              title="Notifications"
              description="Choose how we keep in touch."
              className="lg:col-span-2"
            >
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Push notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        Recommendations & updates on the go.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    {...register("push")}
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email updates</p>
                      <p className="text-xs text-gray-500">
                        Occasional tips and deals.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    {...register("newsletter")}
                  />
                </label>
              </div>
            </Card>

            <Card
              title="Account"
              description="Security & critical actions."
              className="lg:col-span-3"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 hover:bg-gray-50"
                  // TODO: open change password modal → sendPasswordResetEmail(auth, email)
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50"
                  // TODO: open confirm delete modal → delete user from Firebase
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Mobile Save button */}
        <div className="md:hidden">{headerActions}</div>
      </form>
    </div>
  );
};

export default SettingsPage;
