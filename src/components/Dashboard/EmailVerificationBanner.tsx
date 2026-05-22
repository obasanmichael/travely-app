import { MailWarning } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export const EmailVerificationBanner = () => {
  const { user, sendVerificationEmail } = useAuth();
  const [isSending, setIsSending] = useState(false);

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await sendVerificationEmail();
      toast.success("Verification email sent.");
    } catch {
      toast.error("Could not send verification email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card
      padding="sm"
      className="mb-6 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <MailWarning className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">
              Verify your email address
            </p>
            <p className="text-xs text-secondary mt-0.5">
              Check your inbox for a verification link. You can still take the quiz,
              but verifying helps secure your account.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isSending}
          onClick={handleResend}
        >
          {isSending ? "Sending…" : "Resend email"}
        </Button>
      </div>
    </Card>
  );
};
