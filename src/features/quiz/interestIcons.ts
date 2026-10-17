import {
  Binoculars, Building2, Camera, Castle, Droplets, Flame, Footprints, Landmark, Mountain, Music2, Palette,
  Palmtree, Pickaxe, ShoppingBag, Sparkles, Sprout, Sun, Tent, Trees, UtensilsCrossed, Waves, Waypoints, Church,
  Drama, FerrisWheel, Fish, Bird, Sailboat, type LucideIcon,
} from "lucide-react";

/** One icon per taxonomy tag. Unknown tags (added later) fall back to a sparkle. */
export const INTEREST_ICONS: Record<string, LucideIcon> = {
  nature: Trees,
  waterfalls: Droplets,
  "hills-mountains": Mountain,
  "lakes-rivers": Waves,
  beaches: Palmtree,
  caves: Pickaxe,
  wildlife: Binoculars,
  hiking: Footprints,
  swimming: Fish,
  boating: Sailboat,
  birdwatching: Bird,
  camping: Tent,
  photography: Camera,
  history: Castle,
  culture: Drama,
  museums: Landmark,
  art: Palette,
  "sacred-sites": Church,
  festivals: Music2,
  architecture: Building2,
  relaxation: Sun,
  nightlife: Sparkles,
  food: UtensilsCrossed,
  shopping: ShoppingBag,
  amusement: FerrisWheel,
  "city-life": Waypoints,
  adventure: Flame,
};

export function iconFor(slug: string): LucideIcon {
  return INTEREST_ICONS[slug] ?? Sprout;
}
