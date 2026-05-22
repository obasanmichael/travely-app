import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  QuizFormData,
  RecommendationResponse,
  RecommendationRun,
  UserPreferences,
  UserSettings,
} from "../components/types/types";

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName?: string | null;
  bio?: string;
  newsletter?: boolean;
  push?: boolean;
  profilePrivate?: boolean;
  hasCompletedOnboarding: boolean;
  latestRunId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function getUserDocument(uid: string): Promise<UserDocument | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDocument;
}

export async function createUserDocument(
  uid: string,
  data: Pick<UserDocument, "email" | "displayName">
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      email: data.email,
      displayName: data.displayName ?? null,
      hasCompletedOnboarding: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateUserDocument(
  uid: string,
  data: Partial<UserDocument>
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function markOnboardingComplete(uid: string): Promise<void> {
  await updateUserDocument(uid, { hasCompletedOnboarding: true });
}

export async function saveUserPreferences(
  uid: string,
  quizData: QuizFormData
): Promise<void> {
  await setDoc(
    doc(db, "userPreferences", uid),
    {
      ...quizData,
      userId: uid,
      lastUpdated: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserPreferences(
  uid: string
): Promise<UserPreferences | null> {
  const snap = await getDoc(doc(db, "userPreferences", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserPreferences;
}

export async function saveRecommendationRun(
  uid: string,
  preferences: QuizFormData,
  response: RecommendationResponse
): Promise<string> {
  const runRef = doc(collection(db, "users", uid, "recommendationRuns"));
  await setDoc(runRef, {
    preferences,
    user_budget_category: response.user_budget_category,
    recommendations: response.recommendations,
    source: "api",
    apiVersion: "2.0.0",
    createdAt: serverTimestamp(),
  });
  await updateUserDocument(uid, { latestRunId: runRef.id });
  return runRef.id;
}

function runFromSnapshot(
  id: string,
  data: Record<string, unknown>
): RecommendationRun {
  return {
    id,
    preferences: data.preferences as QuizFormData,
    user_budget_category: data.user_budget_category as string,
    recommendations: data.recommendations as RecommendationRun["recommendations"],
    source: "api",
    apiVersion: (data.apiVersion as string) ?? "2.0.0",
    createdAt: data.createdAt,
  };
}

export async function getLatestRecommendationRun(
  uid: string
): Promise<RecommendationRun | null> {
  const userDoc = await getUserDocument(uid);
  if (userDoc?.latestRunId) {
    const runSnap = await getDoc(
      doc(db, "users", uid, "recommendationRuns", userDoc.latestRunId)
    );
    if (runSnap.exists()) {
      return runFromSnapshot(runSnap.id, runSnap.data());
    }
  }

  const runsQuery = query(
    collection(db, "users", uid, "recommendationRuns"),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(runsQuery);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return runFromSnapshot(docSnap.id, docSnap.data());
}

export async function getRecommendationHistory(
  uid: string,
  maxResults = 20
): Promise<RecommendationRun[]> {
  const runsQuery = query(
    collection(db, "users", uid, "recommendationRuns"),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snapshot = await getDocs(runsQuery);
  return snapshot.docs.map((docSnap) =>
    runFromSnapshot(docSnap.id, docSnap.data())
  );
}

export async function getRecommendationRunById(
  uid: string,
  runId: string
): Promise<RecommendationRun | null> {
  const snap = await getDoc(doc(db, "users", uid, "recommendationRuns", runId));
  if (!snap.exists()) return null;
  return runFromSnapshot(snap.id, snap.data());
}

export async function deleteUserData(uid: string): Promise<void> {
  const runsSnap = await getDocs(collection(db, "users", uid, "recommendationRuns"));
  const batch = writeBatch(db);
  runsSnap.docs.forEach((runDoc) => batch.delete(runDoc.ref));
  batch.delete(doc(db, "users", uid));
  batch.delete(doc(db, "userPreferences", uid));
  await batch.commit();
}

export function userDocumentToSettings(doc: UserDocument): UserSettings {
  return {
    displayName: doc.displayName,
    email: doc.email,
    bio: doc.bio ?? "",
    newsletter: doc.newsletter ?? true,
    push: doc.push ?? true,
    profilePrivate: doc.profilePrivate ?? false,
  };
}
