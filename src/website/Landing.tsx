import { useFeatured } from "../features/places/useFeatured";
import { Hero } from "./Hero";
import { LandingNav } from "./LandingNav";
import { Faq, FinalCta, HowItWorks, NumbersStrip, PlacesRow, SiteFooter, Why } from "./Sections";
import { useSample } from "./useSample";

export function Landing() {
  const featured = useFeatured(9);
  const sample = useSample();
  // The hero backdrop is a different place from the cards below it, so one photo isn't shown twice.
  const [backdrop, ...rest] = featured;
  return (
    <div className="bg-bg">
      <LandingNav />
      <main>
        <Hero backdrop={backdrop} sample={sample} />
        <NumbersStrip sample={sample} />
        <HowItWorks />
        <Why sample={sample} />
        <PlacesRow places={rest} />
        <Faq />
        <FinalCta photos={rest} />
      </main>
      <SiteFooter />
    </div>
  );
}
