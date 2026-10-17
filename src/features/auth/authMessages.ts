const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "That email and password don't match. Check them or reset your password.",
  "auth/wrong-password": "That email and password don't match. Check them or reset your password.",
  "auth/user-not-found": "There's no account with that email. Create one instead.",
  "auth/email-already-in-use": "An account already uses that email. Sign in instead.",
  "auth/credential-already-in-use": "An account already uses that email. Sign in instead.",
  "auth/weak-password": "Use a password of at least 8 characters.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes, or reset your password.",
  "auth/popup-closed-by-user": "The Google window was closed before signing in. Try again.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for Travely and try again.",
  "auth/network-request-failed": "Can't reach the sign-in service. Check your connection and try again.",
  "auth/operation-not-allowed": "This sign-in method isn't switched on yet. Try another one.",
};

export function authMessage(code: string): string {
  return MESSAGES[code] ?? `Sign-in didn't work (${code}). Try again.`;
}
