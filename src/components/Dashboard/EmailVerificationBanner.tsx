import { MailWarning } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../ui/Card";

export const EmailVerificationBanner = () => {
  const { user } = useAuth();

  if (!user || user.emailVerified) return null;

  return (
    <Card
      padding="sm"
      className="mb-6 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20"
    >
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
    </Card>
  );
};
