import type { RecommendationItem } from "../../api/client";
import { formatNaira } from "../../lib/format";

type CostComponent = RecommendationItem["cost"]["components"][number];

// An unverified fee is counted as zero in the total, but showing "₦0" would read as "free".
export function amountLabel(component: CostComponent): string {
  if (component.name === "entry_fees" && component.high === 0 && component.confidence === "low") {
    return "Not verified yet";
  }
  if (component.low === component.high) return formatNaira(component.low);
  return `${formatNaira(component.low)}–${formatNaira(component.high)}`;
}
