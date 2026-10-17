import { BudgetStep, ComfortStep, DaysStep, InterestsStep, MonthStep, OriginStep, PaceStep, PeopleStep, type StepProps } from "./Steps";

export const STEPS: { id: string; title: string; hint: string; Component: (props: StepProps) => import("react").JSX.Element }[] = [
  { id: "origin", title: "Where are you starting from?", hint: "We use this to work out travel time and the cost of getting there.", Component: OriginStep },
  { id: "month", title: "When are you going?", hint: "Some places are lovely in one month and miserable in another.", Component: MonthStep },
  { id: "days", title: "How long is the trip?", hint: "Include the days you travel.", Component: DaysStep },
  { id: "people", title: "Who's coming?", hint: "Costs are for the whole group.", Component: PeopleStep },
  { id: "budget", title: "What's your total budget?", hint: "For everyone, for the whole trip.", Component: BudgetStep },
  { id: "comfort", title: "How comfortable do you want to be?", hint: "This sets the kind of stay and meals we price.", Component: ComfortStep },
  { id: "interests", title: "What do you enjoy?", hint: "Pick up to eight. We'll match places to these.", Component: InterestsStep },
  { id: "pace", title: "What's your pace?", hint: "And how far you're willing to travel.", Component: PaceStep },
];
