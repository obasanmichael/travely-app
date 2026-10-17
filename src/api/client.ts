import { captureException } from "@sentry/react";
import { FirebaseError } from "firebase/app";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/firebase";
import type { components } from "./schema";

export type RecommendationRequest =
  components["schemas"]["api__v1__schemas__RecommendationRequest"];
export type RecommendationResponse =
  components["schemas"]["api__v1__schemas__RecommendationResponse"];
export type RecommendationItem = components["schemas"]["RecommendationOut"];
export type Meta = components["schemas"]["MetaResponse"];
export type Interest = Meta["interests"][number];
export type Destination = components["schemas"]["DestinationOut"];
export type RunSummary = components["schemas"]["RunSummary"];
export type PublicSample = components["schemas"]["PublicSample"];
export type RunDetail = components["schemas"]["RunDetail"];
export type DestinationPage = components["schemas"]["api__v1__schemas__DestinationPage"];
export type Profile = components["schemas"]["ProfileOut"];
// The generator marks fields with server defaults as required; every field is optional on the wire.
export type ProfilePatch = Partial<components["schemas"]["ProfilePatch"]>;
export type AdminDestination = components["schemas"]["AdminDestination"];
export type AdminPage = components["schemas"]["api__v1__admin__DestinationPage"];
export type ReviewBody = Partial<components["schemas"]["ReviewRequest"]> & { action: components["schemas"]["ReviewRequest"]["action"] };
export type PriceBody = Partial<components["schemas"]["PriceObservationIn"]> &
  Pick<components["schemas"]["PriceObservationIn"], "component" | "unit" | "subject" | "amount" | "observed_on" | "source_url">;
export type CoverageRow = components["schemas"]["CoverageRow"];
export type PublishResult = components["schemas"]["PublishResponse"];
export type BudgetBand = components["schemas"]["BudgetBandResponse"];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryable: boolean
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** What the user should read for each failure: what happened and what to do next. */
export function describeFailure(status: number, detail?: string): ApiError {
  if (status === 0) {
    return new ApiError("Can't reach Travely. Check your connection and try again.", 0, true);
  }
  if (status === 401) {
    return new ApiError("Your session expired. Reload the page to continue.", status, false);
  }
  if (status === 409) {
    return new ApiError(detail ?? "This search was already submitted. Start a new search.", status, false);
  }
  if (status === 422) {
    return new ApiError(detail ?? "Some answers aren't valid. Check them and try again.", status, false);
  }
  if (status === 429) {
    return new ApiError("Too many searches in a minute. Wait a moment and try again.", status, true);
  }
  if (status === 503) {
    return new ApiError("Travely is updating its places. Try again in a minute.", status, true);
  }
  return new ApiError("Something went wrong on our side. Try again.", status, true);
}

async function idToken(): Promise<string> {
  // Visitors can search before signing up: an anonymous account keeps their
  // results and upgrades in place when they create a real one.
  try {
    const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
    return await user.getIdToken();
  } catch (error) {
    captureException(error);
    const code = error instanceof FirebaseError ? error.code : "unknown";
    if (code === "auth/network-request-failed") throw describeFailure(0);
    if (code === "auth/operation-not-allowed" || code === "auth/admin-restricted-operation") {
      throw new ApiError("Searching without an account isn't switched on yet. Sign in to search.", 401, false);
    }
    throw new ApiError(`Couldn't start your session (${code}). Reload the page and try again.`, 401, true);
  }
}

async function request<T>(path: string, init: RequestInit = {}, withAuth = true): Promise<T> {
  const response = await send(path, init, withAuth);
  return (await response.json()) as T;
}

const FIELD_NAMES: Record<string, string> = {
  days: "trip length",
  budget: "budget",
  travellers: "number of travellers",
  origin_state: "starting state",
  month: "month",
};

/** FastAPI sends 422 problems as a list; say which answer is wrong instead of a generic message. */
function describeValidation(detail: unknown): string | undefined {
  if (!Array.isArray(detail) || detail.length === 0) return undefined;
  const field = detail[0]?.loc?.at?.(-1);
  const name = typeof field === "string" ? FIELD_NAMES[field] : undefined;
  return name ? `Check your ${name}: it isn't something we can plan for. Change it and try again.` : undefined;
}

async function send(path: string, init: RequestInit = {}, withAuth = true): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (withAuth) headers.set("Authorization", `Bearer ${await idToken()}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw describeFailure(0);
  }
  if (!response.ok) {
    let detail: string | undefined;
    try {
      const body = await response.json();
      detail = typeof body.detail === "string" ? body.detail : undefined;
      if (response.status === 422) detail ??= describeValidation(body.detail);
    } catch {
      // Non-JSON error bodies fall back to the generic message.
    }
    throw describeFailure(response.status, detail);
  }
  return response;
}

export function getMeta(): Promise<Meta> {
  return request<Meta>("/v1/meta", {}, false);
}

export function getRecommendations(
  body: RecommendationRequest,
  idempotencyKey: string
): Promise<RecommendationResponse> {
  return request<RecommendationResponse>("/v1/recommendations", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Idempotency-Key": idempotencyKey },
  });
}

export function getFeatured(limit = 6): Promise<Destination[]> {
  return request<Destination[]>(`/v1/destinations/featured?limit=${limit}`, {}, false);
}

export function getDestination(slug: string): Promise<Destination> {
  return request<Destination>(`/v1/destinations/${encodeURIComponent(slug)}`, {}, false);
}

export function getSaved(): Promise<Destination[]> {
  return request<Destination[]>("/v1/me/saved");
}

export async function setSaved(destinationId: string, saved: boolean): Promise<void> {
  await send(`/v1/me/saved/${destinationId}`, { method: saved ? "PUT" : "DELETE" });
}

export function getRuns(): Promise<RunSummary[]> {
  return request<RunSummary[]>("/v1/me/runs");
}

export async function mergeGuest(anonymousToken: string): Promise<void> {
  await send("/v1/me/merge", { method: "POST", body: JSON.stringify({ anonymous_token: anonymousToken }) });
}

export function getSample(): Promise<PublicSample> {
  return request<PublicSample>("/v1/public/sample", {}, false);
}

export function getTrip(runId: string): Promise<RunDetail> {
  return request<RunDetail>(`/v1/me/runs/${encodeURIComponent(runId)}`);
}

export function getBudgetBand(perPersonPerDay: number): Promise<BudgetBand> {
  return request<BudgetBand>(`/v1/meta/budget-band?per_person_per_day=${perPersonPerDay}`, {}, false);
}

export interface BrowseFilters {
  q?: string;
  state?: string;
  interest?: string;
  month?: number;
  page?: number;
  pageSize?: number;
}

export function browseDestinations(filters: BrowseFilters = {}): Promise<DestinationPage> {
  const params = new URLSearchParams();
  if (filters.q && filters.q.trim().length >= 2) params.set("q", filters.q.trim());
  if (filters.state) params.set("state", filters.state);
  if (filters.interest) params.set("interest", filters.interest);
  if (filters.month) params.set("month", String(filters.month));
  params.set("page", String(filters.page ?? 1));
  params.set("page_size", String(filters.pageSize ?? 24));
  return request<DestinationPage>(`/v1/destinations?${params}`, {}, false);
}

export function getProfile(): Promise<Profile> {
  return request<Profile>("/v1/me/profile");
}

export function patchProfile(patch: ProfilePatch): Promise<Profile> {
  return request<Profile>("/v1/me/profile", { method: "PATCH", body: JSON.stringify(patch) });
}

/** The user's data as a file download. */
export async function downloadMyData(): Promise<void> {
  const response = await send("/v1/me/export");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "travely-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

export async function deleteMyAccount(): Promise<void> {
  await send("/v1/me", { method: "DELETE" });
}

export interface AdminFilters {
  status?: "candidate" | "published" | "rejected";
  state?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export function adminList(filters: AdminFilters = {}): Promise<AdminPage> {
  const pageSize = filters.pageSize ?? 20;
  const params = new URLSearchParams({ status: filters.status ?? "candidate", limit: String(pageSize), offset: String(((filters.page ?? 1) - 1) * pageSize) });
  if (filters.state) params.set("state", filters.state);
  if (filters.q && filters.q.trim().length >= 2) params.set("q", filters.q.trim());
  return request<AdminPage>(`/v1/admin/destinations?${params}`);
}

export function adminReview(id: string, body: ReviewBody): Promise<AdminDestination> {
  return request<AdminDestination>(`/v1/admin/destinations/${id}/review`, { method: "POST", body: JSON.stringify(body) });
}

export function adminAddPrice(body: PriceBody): Promise<{ id: number }> {
  return request<{ id: number }>("/v1/admin/price-observations", { method: "POST", body: JSON.stringify(body) });
}

export function adminCoverage(): Promise<CoverageRow[]> {
  return request<CoverageRow[]>("/v1/admin/coverage");
}

export function adminPublish(): Promise<PublishResult> {
  return request<PublishResult>("/v1/admin/catalog/publish", { method: "POST" });
}
