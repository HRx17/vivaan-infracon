import type { Project, SiteSettings } from "./types";


export const DEFAULT_SETTINGS: SiteSettings = {
  ownerName: "Nileesh Baldha",
  brandName: "Vivaan Infracon",
  tagline: "Homes and spaces built to outlast the people who commission them.",
  intro:
    "I'm Nileesh Baldha, builder and founder of Vivaan Infracon. Every project carries my name, so I stay on site from the first drawing to the day the keys change hands.",
  about:
    "Vivaan Infracon designs and builds residential and commercial projects with an obsession for honest materials, careful detailing and on-time handover. We work with landowners, investors and families who want a builder who answers the phone.",
  email: "vivaaninfracon111@gmail.com",
  phone: "+91 97125 12531",
  whatsapp: "919712512531",
  address: "",
  instagram: "",
  linkedin: "",
  heroImage: { url: "/projects/sky-revanta/aerial-view.jpg", alt: "Aerial view of Sky Revanta on its corner plot" },
  portrait: null,
  partners: [],
  // Add real figures from Admin → Site settings (e.g. years building, projects delivered); the strip is hidden while empty.
  stats: [],
};

const now = new Date().toISOString();
function p(i: number, data: Omit<Project, "id" | "order" | "createdAt" | "updatedAt" | "visibility">): Project {
  return { id: `sample-${i}`, order: i, createdAt: now, updatedAt: now, visibility: "published", ...data };
}

export const SAMPLE_PROJECTS: Project[] = [
  // REAL PROJECT — from the Sky Revanta brochure and Instagram. Renders are artist's impressions.
  p(0, {
    slug: "sky-revanta",
    title: "Sky Revanta",
    status: "ongoing",
    category: "4 BHK residences + Showrooms",
    location: "Science City, Ahmedabad",
    year: "",
    summary:
      "48 premium 4 BHK residences of 4,032 sq. ft. above 22 street-front showrooms, on a corner plot facing 30 m and 18 m roads off Canal Road, Science City.",
    description:
      "Sky Revanta is a 4 BHK opulence-living and showroom address in Science City, developed jointly by Saundarya Group, ADI Infrastructure and Vivaan Infracon. Forty-eight homes rise across the 2nd to 13th floors, above two levels of street-front showrooms on a corner plot facing a 30-metre and an 18-metre road.\n\n" +
      "Every residence is a 4,032 sq. ft. 4 BHK, with just four homes to a floor. Each is planned around a separate formal living room (13' × 20') and a family living and dining space (12' × 24'6\"), a 19'7\" balcony, four bedrooms (the two largest with their own dressing areas), a puja room, store and wash area, entered through a private foyer at the lift lobby.\n\n" +
      "Residents get a landscaped ground-level garden with an amphitheatre, gazebo seating, a water feature, children's and toddler play areas and a library; a gymnasium and an indoor games room on the first floor; and an open terrace garden with a gazebo deck on the second. The site is gated, with 24×7 security, CCTV, intercom and basement parking.\n\n" +
      "Finishes include 800×800 vitrified tiles, wooden flooring in the master bedroom, a granite kitchen platform, designer bathroom tiles to lintel level, and concealed copper wiring and AC piping, with brands such as Kajaria, Grohe, Jaquar, Schneider, Legrand and OTIS lifts, or equivalent.",
    cover: { url: "/projects/sky-revanta/night-elevation.jpg", alt: "Sky Revanta at dusk, artist's impression" },
    gallery: [
      { url: "/projects/sky-revanta/day-elevation.jpg", alt: "Front elevation on the 30 m road", wide: true },
      { url: "/projects/sky-revanta/corner-view.jpg", alt: "Corner view from the 18 m road" },
      { url: "/projects/sky-revanta/street-view.jpg", alt: "Street view across the junction" },
      { url: "/projects/sky-revanta/aerial-view.jpg", alt: "Aerial view of the corner plot", wide: true },
      { url: "/projects/sky-revanta/living-dining.jpg", alt: "Living and dining room", wide: true },
      { url: "/projects/sky-revanta/living-room.jpg", alt: "Formal living with city views" },
      { url: "/projects/sky-revanta/master-bedroom.jpg", alt: "Master bedroom" },
      { url: "/projects/sky-revanta/balcony.jpg", alt: "19'7\" balcony off the living room", wide: true },
      { url: "/projects/sky-revanta/entrance-gate.jpg", alt: "Gated entrance with boom barrier" },
      { url: "/projects/sky-revanta/entrance-court.jpg", alt: "Entrance court and lobby" },
      { url: "/projects/sky-revanta/garden-gazebo.jpg", alt: "Gazebo seating and water feature" },
      { url: "/projects/sky-revanta/landscape-garden.jpg", alt: "Landscaped garden" },
      { url: "/projects/sky-revanta/children-play-area.jpg", alt: "Children's play area", wide: true },
      { url: "/projects/sky-revanta/indoor-games.jpg", alt: "Indoor games room (42'9\" × 33'9\")" },
      { url: "/projects/sky-revanta/gymnasium.jpg", alt: "Gymnasium (32'6\" × 33'9\")" },
      { url: "/projects/sky-revanta/courtyard-aerial.jpg", alt: "Garden courtyard and first-floor terrace from above", wide: true },
      { url: "/projects/sky-revanta/plan-4bhk-unit.jpg", alt: "4 BHK unit plan, 4,032 sq. ft.", wide: true },
      { url: "/projects/sky-revanta/plan-ground-floor.jpg", alt: "Ground floor plan: 11 showrooms, gardens and amenities", wide: true },
    ],
    specs: [
      { label: "Residences", value: "48 × 4 BHK, four per floor" },
      { label: "Home size", value: "4,032 sq. ft." },
      { label: "Building", value: "14 storeys, ground + 13; homes on 2nd–13th" },
      { label: "Showrooms", value: "22, on ground and first floor" },
      { label: "Road frontage", value: "Corner plot on 30 m & 18 m roads" },
      { label: "Parking", value: "Basement and surface parking" },
      { label: "Amenities", value: "Gymnasium, Indoor games, Library, Amphitheatre, Landscaped garden, Gazebo seating, Water feature, Open terrace garden, Children's play area, Toddler play area, Senior citizen seating, School pick-up stand, Attractive foyer, Grand entrance gate, Basement parking, 24×7 security, CCTV, Intercom" },
      { label: "Safety", value: "24×7 security, CCTV, intercom" },
      { label: "Flooring", value: "800×800 vitrified tiles; wooden floor in master bedroom" },
      { label: "Kitchen", value: "Polished granite platform, stainless-steel sink" },
      { label: "Air conditioning", value: "Concealed copper piping, AC point in every room" },
      { label: "Developed by", value: "Saundarya Group · ADI Infrastructure · Vivaan Infracon" },
      { label: "Architect", value: "ADS Architect Pvt. Ltd." },
      { label: "Gujarat RERA", value: "PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/MAA10131/300422" },
      { label: "Address", value: "B/h Serenity Lavish, Opp. Avadh 28, Nr. Saumya Residency, Canal Road, Science City, Ahmedabad" },
      { label: "Sales & site visits", value: "+91 97125 12531 / 12532 · skyrevanta111@gmail.com" },
    ],
    featured: true,
  }),
  // Projects listed by Nileesh Baldha. Only verified facts are filled in; add the rest from Admin → Projects.
  p(1, {
    slug: "rj-pulse",
    title: "RJ Pulse",
    status: "ongoing",
    category: "Commercial",
    location: "Ahmedabad",
    year: "",
    summary: "",
    description: "",
    cover: null,
    gallery: [],
    specs: [],
    featured: true,
  }),
  p(2, {
    slug: "radhe-time-square",
    title: "Radhe Time Square",
    status: "completed",
    category: "Commercial",
    location: "Ahmedabad",
    year: "",
    summary: "A glass-fronted commercial landmark, now home to shops, restaurants and hotels.",
    description: "",
    cover: { url: "/projects/radhe-time-square/night-render.jpg", alt: "Radhe Time Square at dusk" },
    gallery: [
      { url: "/projects/radhe-time-square/on-site.jpg", alt: "Radhe Time Square today, open and occupied", wide: true },
      { url: "/projects/radhe-time-square/day-render.jpg", alt: "Front view", wide: true },
    ],
    specs: [],
    featured: true,
  }),
  p(3, { slug: "radhe-111", title: "Radhe 111", status: "completed", category: "", location: "", year: "", summary: "", description: "", cover: null, gallery: [], specs: [], featured: false }),
  p(4, { slug: "radhe-square", title: "Radhe Square", status: "completed", category: "", location: "", year: "", summary: "", description: "", cover: null, gallery: [], specs: [], featured: false }),
  p(5, { slug: "radhe-crystal", title: "Radhe Crystal", status: "completed", category: "", location: "", year: "", summary: "", description: "", cover: null, gallery: [], specs: [], featured: false }),
];
