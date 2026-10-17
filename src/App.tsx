import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Skeleton } from "./ui/Skeleton";
import { Landing } from "./website/Landing";

// Everything past the landing page loads on demand, so first-time visitors download only the website.
const lazyNamed = <T extends Record<string, React.ComponentType>>(load: () => Promise<T>, name: keyof T) =>
  lazy(() => load().then((module) => ({ default: module[name] })));

const AuthPage = lazy(() => import("./features/auth/AuthPage").then((m) => ({ default: m.AuthPage as React.ComponentType<{ mode: "signin" | "signup" | "reset" }> })));
const AppShell = lazyNamed(() => import("./app/AppShell"), "AppShell");
const OverviewPage = lazyNamed(() => import("./app/OverviewPage"), "OverviewPage");
const QuizPage = lazyNamed(() => import("./features/quiz/QuizPage"), "QuizPage");
const TripPage = lazyNamed(() => import("./features/trips/TripPage"), "TripPage");
const TripsPage = lazyNamed(() => import("./features/trips/TripsPage"), "TripsPage");
const ExplorePage = lazyNamed(() => import("./features/explore/ExplorePage"), "ExplorePage");
const PlacePage = lazyNamed(() => import("./features/places/PlacePage"), "PlacePage");
const SavedPage = lazyNamed(() => import("./features/saved/SavedPage"), "SavedPage");
const SettingsPage = lazyNamed(() => import("./features/settings/SettingsPage"), "SettingsPage");
const AdminGuard = lazyNamed(() => import("./features/admin/AdminGuard"), "AdminGuard");
const ReviewPage = lazyNamed(() => import("./features/admin/ReviewPage"), "ReviewPage");
const PricesPage = lazyNamed(() => import("./features/admin/PricesPage"), "PricesPage");
const NotFound = lazyNamed(() => import("./pages/NotFound"), "NotFound");

function Loading() {
  return (
    <div aria-busy="true" role="status" className="flex min-h-dvh items-start justify-center bg-bg p-10">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-48" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/reset" element={<AuthPage mode="reset" />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="plan" element={<QuizPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="trips/:runId" element={<TripPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="places/:slug" element={<PlacePage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<AdminGuard />}>
            <Route path="review" element={<ReviewPage />} />
            <Route path="prices" element={<PricesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
