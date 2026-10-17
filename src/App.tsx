import { Route, Routes } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { OverviewPage } from "./app/OverviewPage";
import { SettingsPage } from "./app/SettingsPage";
import { AuthPage } from "./features/auth/AuthPage";
import { PlacePage } from "./features/places/PlacePage";
import { TripPage } from "./features/trips/TripPage";
import { QuizPage } from "./features/quiz/QuizPage";
import { SavedPage } from "./features/saved/SavedPage";
import { SearchesPage } from "./features/searches/SearchesPage";
import { Landing } from "./website/Landing";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<AuthPage mode="signin" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/reset" element={<AuthPage mode="reset" />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="plan" element={<QuizPage />} />
        <Route path="trips/:runId" element={<TripPage />} />
        <Route path="places/:slug" element={<PlacePage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="trips" element={<SearchesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
