/** Scroll-driven "immersive" tours, keyed by project slug. Coordinates are fractions of the base image. */
export type TourIcon = "balcony" | "sofa" | "bed" | "play" | "shop" | "gate" | "tree" | "child" | "gym";
export interface TourStop {
  base: number;
  x: number;
  y: number;
  z: number;
  side?: "left" | "right";
  label?: string;
  sub?: string;
  icon?: TourIcon;
  media?: { type: "image" | "video"; src: string; alt: string; poster?: string };
}
export interface Tour {
  title: string;
  tagline: string;
  bases: { src: string; w: number; h: number }[];
  stops: TourStop[];
  figures: { value: string; label: string }[];
}

const P = "/projects/sky-revanta";
export const TOURS: Record<string, Tour> = {
  "sky-revanta": {
    title: "Sky Revanta",
    tagline: "4 BHK homes · Science City, Ahmedabad",
    bases: [
      { src: "/tour/night-full.jpg", w: 2728, h: 2239 },
      { src: "/tour/courtyard-full.jpg", w: 2728, h: 1372 },
    ],
    stops: [
      { base: 0, x: 0.5, y: 0.5, z: 1 },
      { base: 0, x: 0.557, y: 0.215, z: 2.8, side: "right", icon: "balcony", label: "Private balcony", sub: "19′7″ wide", media: { type: "image", src: `${P}/balcony.jpg`, alt: "Balcony with city views" } },
      { base: 0, x: 0.43, y: 0.37, z: 3, side: "right", icon: "sofa", label: "Grand living room", sub: "Separate formal living", media: { type: "image", src: `${P}/living-dining.jpg`, alt: "Living and dining room" } },
      { base: 0, x: 0.73, y: 0.42, z: 3, side: "left", icon: "bed", label: "Master bedroom", sub: "Wooden flooring", media: { type: "image", src: `${P}/master-bedroom.jpg`, alt: "Master bedroom" } },
      { base: 0, x: 0.56, y: 0.57, z: 2.6, side: "right", icon: "play", label: "Sample flat", sub: "Ready to visit", media: { type: "video", src: "/tour/sample-house.mp4", poster: "/tour/sample-house-poster.jpg", alt: "Walkthrough of the sample flat" } },
      { base: 0, x: 0.52, y: 0.86, z: 2.4, side: "right", icon: "shop", label: "22 showrooms", sub: "On the main road", media: { type: "image", src: `${P}/street-view.jpg`, alt: "Showrooms along the road" } },
      { base: 0, x: 0.26, y: 0.85, z: 2.6, side: "right", icon: "gate", label: "Gated entrance", sub: "24×7 security", media: { type: "image", src: `${P}/entrance-gate.jpg`, alt: "Gated entrance" } },
      { base: 1, x: 0.64, y: 0.67, z: 2.2, side: "left", icon: "tree", label: "Garden & gazebo", sub: "Green courtyard", media: { type: "image", src: `${P}/garden-gazebo.jpg`, alt: "Garden with gazebo seating" } },
      { base: 1, x: 0.88, y: 0.77, z: 2.6, side: "left", icon: "child", label: "Kids' play area", sub: "Safe & shaded", media: { type: "image", src: `${P}/children-play-area.jpg`, alt: "Children's play area" } },
      { base: 1, x: 0.4, y: 0.74, z: 2.4, side: "right", icon: "gym", label: "Gym & games", sub: "On the first floor", media: { type: "image", src: `${P}/gymnasium.jpg`, alt: "Gymnasium" } },
      { base: 0, x: 0.5, y: 0.5, z: 1 },
    ],
    figures: [
      { value: "48", label: "Homes" },
      { value: "4,032", label: "Sq. ft. each" },
      { value: "22", label: "Showrooms" },
    ],
  },
};
