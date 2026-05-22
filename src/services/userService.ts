import {
  createUserDocument,
  deleteUserData,
  getUserDocument,
  updateUserDocument,
  userDocumentToSettings,
} from "../firebase/firestore";
import type { UserSettings } from "../components/types/types";

export async function ensureUserDocument(
  uid: string,
  email: string | null,
  displayName?: string | null
) {
  const existing = await getUserDocument(uid);
  if (existing) return existing;

  await createUserDocument(uid, { email, displayName });
  const created = await getUserDocument(uid);
  if (!created) {
    throw new Error("Failed to create user document");
  }
  return created;
}

export async function loadUserSettings(uid: string): Promise<UserSettings | null> {
  const doc = await getUserDocument(uid);
  if (!doc) return null;
  return userDocumentToSettings(doc);
}

export async function saveUserSettings(
  uid: string,
  settings: UserSettings
): Promise<void> {
  await updateUserDocument(uid, {
    displayName: settings.displayName ?? null,
    bio: settings.bio ?? "",
    newsletter: settings.newsletter ?? true,
    push: settings.push ?? true,
    profilePrivate: settings.profilePrivate ?? false,
  });
}

export async function deleteAccountData(uid: string): Promise<void> {
  await deleteUserData(uid);
}
