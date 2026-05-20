import { Compass, Sparkles } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";

const SearchPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-lg w-full text-center" padding="lg">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-accent-soft flex items-center justify-center mb-6">
          <Compass className="w-10 h-10 text-travel-600 dark:text-travel-400 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-travel-700 dark:text-travel-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Coming soon
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3 tracking-tight">
          Explore is on the way
        </h1>

        <p className="text-secondary text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          We&apos;re building a richer discovery experience so you can browse
          destinations, compare regions, and plan your next Nigerian adventure.
        </p>

        <img
          src="/Trip-rafiki.svg"
          alt="Travel illustration"
          className="w-56 md:w-64 mx-auto mb-8 opacity-90 dark:opacity-80"
        />

        <ButtonLink to="/recommendations" variant="primary" size="lg">
          Back to recommendations
        </ButtonLink>
      </Card>
    </div>
  );
};

export default SearchPage;
