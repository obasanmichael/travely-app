import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, getProfile, getRecommendations } from "../../api/client";
import { useAuth } from "../auth/authContext";
import { Button } from "../../ui/Button";
import { Skeleton } from "../../ui/Skeleton";
import { DEFAULT_SEARCH, newSearchKey, toRequest, validate, type SearchState } from "../search/searchState";
import { useMeta } from "../search/useMeta";
import { Generating } from "./Generating";
import { Review } from "./Review";
import { clearDraft, loadDraft, saveDraft } from "./draft";
import { STEPS } from "./stepsConfig";

const REVIEW = STEPS.length;
const MIN_GENERATING_MS = 1800;

interface Prefill {
  prefill?: SearchState;
  step?: number;
}

export function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const meta = useMeta();
  const incoming = (location.state ?? {}) as Prefill;
  const { user } = useAuth();

  const initial = useRef(
    incoming.prefill
      ? { state: incoming.prefill, step: incoming.step ?? 0 }
      : (loadDraft() ?? { state: DEFAULT_SEARCH, step: 0 })
  ).current;
  const [state, setState] = useState<SearchState>(initial.state);
  const [step, setStep] = useState(Math.min(initial.step, REVIEW));
  const [direction, setDirection] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);

  useEffect(() => saveDraft({ state, step }), [state, step]);

  // A brand-new quiz starts from the user's saved home state and preferences.
  const startedFresh = useRef(!incoming.prefill && !loadDraft());
  useEffect(() => {
    if (!user || !startedFresh.current) return;
    startedFresh.current = false;
    let cancelled = false;
    getProfile()
      .then((profile) => {
        if (cancelled) return;
        setState((current) => {
          // Don't overwrite anything the user has already started changing.
          if (JSON.stringify(current) !== JSON.stringify(DEFAULT_SEARCH)) return current;
          return {
            ...current,
            origin: profile.home_state ?? current.origin,
            tier: profile.preferences.tier ?? current.tier,
            pace: profile.preferences.pace ?? current.pace,
            interests: (profile.preferences.interests ?? {}) as SearchState["interests"],
          };
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user]);

  const update = useCallback((patch: Partial<SearchState>) => setState((s) => ({ ...s, ...patch })), []);
  const go = (next: number) => {
    setDirection(next >= step ? 1 : -1);
    setStep(next);
    setError(null);
  };

  const problems = validate(state);
  const stepInvalid = step === 4 && state.budget < 1000;

  const generate = async () => {
    if (problems.length > 0) {
      setError(problems[0]);
      return;
    }
    setError(null);
    setGenerating(true);
    const request = toRequest(state);
    const fingerprint = JSON.stringify(request);
    // The same answers reuse their key, so a retry replays the stored run instead of making a second.
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, key: newSearchKey() };
    const started = Date.now();
    try {
      const data = await getRecommendations(request, attempt.current.key);
      const wait = Math.max(0, MIN_GENERATING_MS - (Date.now() - started));
      await new Promise((resolve) => setTimeout(resolve, reduce ? 0 : wait));
      if (!data.run_id) throw new ApiError("Your trip couldn't be saved. Try again.", 500, true);
      clearDraft();
      navigate(`/app/trips/${data.run_id}`, { state: { fresh: data } });
    } catch (failure) {
      setGenerating(false);
      setError(failure instanceof ApiError ? failure.message : "Something went wrong. Try again.");
    }
  };

  if (meta.status === "loading") {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-10 h-10 w-3/4" />
        <Skeleton className="mt-8 h-64 w-full" />
      </div>
    );
  }
  if (meta.status === "error") {
    return (
      <div role="alert" className="mx-auto max-w-xl rounded-3xl border border-line bg-surface p-8 text-center">
        <p className="m-0 font-semibold text-ink">{meta.message}</p>
        <Button onClick={meta.retry} className="mt-5">
          Try again
        </Button>
      </div>
    );
  }
  if (generating) return <Generating />;

  const onReview = step === REVIEW;
  const current = STEPS[step];
  const progress = ((onReview ? REVIEW : step) / REVIEW) * 100;
  const offset = reduce ? 0 : 36 * direction;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between text-sm text-muted">
          <span>{onReview ? "Review" : `Question ${step + 1} of ${STEPS.length}`}</span>
          {!onReview && (
            <button type="button" onClick={() => go(REVIEW)} className="font-medium text-muted underline hover:text-ink">
              Skip to review
            </button>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Quiz progress">
          <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }} />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.section
          key={step}
          initial={{ opacity: 0, x: offset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -offset }}
          transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
          aria-live="polite"
          className="min-h-[440px]"
        >
          {onReview ? (
            <Review state={state} meta={meta.meta} onEdit={go} problems={problems} />
          ) : (
            <>
              <h2 className="m-0 font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-tight text-ink">{current.title}</h2>
              <p className="mb-8 mt-3 text-muted">{current.hint}</p>
              <current.Component state={state} update={update} meta={meta.meta} />
            </>
          )}
        </motion.section>
      </AnimatePresence>

      {error && (
        <p role="alert" className="mb-0 mt-6 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Pinned above the tab bar on phones so Continue is never below the fold. */}
      <div className="sticky bottom-[76px] z-10 -mx-4 mt-10 flex items-center justify-between gap-3 border-t border-line bg-bg/90 px-4 py-3 backdrop-blur-xl lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Button>
        {onReview ? (
          <Button size="lg" onClick={() => void generate()} disabled={problems.length > 0}>
            Find my places <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        ) : (
          <Button size="lg" onClick={() => go(step + 1)} disabled={stepInvalid}>
            Continue <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
