export function safeNext(value: string | null): string {
  // Only same-site paths, so a crafted link can't bounce people elsewhere after sign-in.
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/app";
}
