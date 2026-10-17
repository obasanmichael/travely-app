import { useNavigate } from "react-router-dom";
import { SearchSentence } from "../features/search/SearchSentence";
import { DEFAULT_SEARCH, newSearchKey, toParams } from "../features/search/searchState";
import { useMeta } from "../features/search/useMeta";

export function PlanPage() {
  const navigate = useNavigate();
  const meta = useMeta();
  if (meta.status !== "ready") return <p className="text-muted">{meta.status === "error" ? meta.message : "Loading…"}</p>;
  return (
    <SearchSentence
      meta={meta.meta}
      initial={DEFAULT_SEARCH}
      onSubmit={(search) => navigate(`/app/results?${toParams(search, newSearchKey())}`)}
    />
  );
}
