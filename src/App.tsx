import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SignInPage } from "./features/auth/SignInPage";
import { PlacePage } from "./features/places/PlacePage";
import { ResultsPage } from "./features/results/ResultsPage";
import { SavedPage } from "./features/saved/SavedPage";
import { SearchesPage } from "./features/searches/SearchesPage";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/places/:slug" element={<PlacePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/searches" element={<SearchesPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
