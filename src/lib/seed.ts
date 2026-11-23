import type { Project, SiteSettings } from "./types";

// SAMPLE CONTENT — replace from /admin. Photos are Unsplash placeholders.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

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
  heroImage: { url: "/projects/sky-revanta/night-elevation.jpg", alt: "Sky Revanta at dusk: lit balconies above two levels of showrooms" },
  portrait: null,
  stats: [
    { label: "Years building", value: "10+" },
    { label: "Projects delivered", value: "25+" },
    { label: "Sq. ft. constructed", value: "1M+" },
  ],
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
  p(1, {
    slug: "the-aranya-villas",
    title: "The Aranya Villas",
    status: "completed",
    category: "Villas",
    location: "Surat, Gujarat",
    year: "2023",
    summary: "Fourteen courtyard villas arranged around a shared garden, finished in lime plaster and teak.",
    description:
      "Aranya began with a simple brief: build homes that stay cool without leaning on air conditioning. Each villa turns inward to a private courtyard, with deep overhangs and cross-ventilated rooms.\n\nWe sourced local stone for the boundary walls and kept the original neem trees on site, routing the internal road around them.",
    cover: { url: u("1613490493576-7fde63acd811"), alt: "Villa with pool and timber deck" },
    gallery: [
      { url: u("1600596542815-ffad4c1539a9"), alt: "Villa facade at evening" },
      { url: u("1600607687939-ce8a6c25118c"), alt: "Double-height living room" },
      { url: u("1600566753190-17f0baa2a6c3"), alt: "Kitchen with stone island" },
    ],
    specs: [
      { label: "Homes", value: "14 villas" },
      { label: "Built-up area", value: "62,000 sq. ft." },
      { label: "Plot", value: "3.2 acres" },
      { label: "Handover", value: "On schedule" },
    ],
    featured: true,
  }),
  p(2, {
    slug: "vivaan-business-centre",
    title: "Vivaan Business Centre",
    status: "completed",
    category: "Commercial",
    location: "Surat, Gujarat",
    year: "2021",
    summary: "A seven-storey office building with column-free floor plates and a shaded public forecourt.",
    description:
      "Built for owner-occupiers, the Business Centre offers flexible floors that can be split into suites as small as 600 sq. ft. A ventilated façade cuts afternoon heat gain on the west side.",
    cover: { url: u("1486406146926-c627a92ad1ab"), alt: "Glass office tower against the sky" },
    gallery: [{ url: u("1487958449943-2429e8be8625"), alt: "White architectural facade" }],
    specs: [
      { label: "Floors", value: "G + 7" },
      { label: "Built-up area", value: "1,10,000 sq. ft." },
      { label: "Parking", value: "2 basements" },
    ],
    featured: false,
  }),
  p(3, {
    slug: "vivaan-residency",
    title: "Vivaan Residency",
    status: "ongoing",
    category: "Residential",
    location: "Surat, Gujarat",
    year: "2025 – 2027",
    summary: "Two towers of 3 and 4 BHK residences with generous balconies and a rooftop club.",
    description:
      "Structure is complete up to the ninth slab. Every apartment is a corner unit, with three sides of light and a 10-foot deep balcony off the living room.",
    cover: { url: u("1545324418-cc1a3fa10c00"), alt: "Residential apartment tower" },
    gallery: [{ url: u("1541888946425-d81bb19240f5"), alt: "Construction site with crane" }],
    specs: [
      { label: "Residences", value: "96" },
      { label: "Configuration", value: "3 & 4 BHK" },
      { label: "Progress", value: "9th slab cast" },
    ],
    featured: true,
  }),
  p(4, {
    slug: "riverside-row-houses",
    title: "Riverside Row Houses",
    status: "ongoing",
    category: "Residential",
    location: "Surat, Gujarat",
    year: "2025 – 2026",
    summary: "Twenty-two row houses with private terraces, planned for families moving up from apartments.",
    description: "Foundations and plinth are complete across all units. Sample house opening soon.",
    cover: { url: u("1504307651254-35680f356dfd"), alt: "Builder reviewing work on site" },
    gallery: [],
    specs: [
      { label: "Homes", value: "22" },
      { label: "Configuration", value: "4 BHK row houses" },
    ],
    featured: false,
  }),
  p(5, {
    slug: "vivaan-skyline",
    title: "Vivaan Skyline",
    status: "upcoming",
    category: "Mixed use",
    location: "Surat, Gujarat",
    year: "Launching 2027",
    summary: "A mixed-use landmark: retail at street level, offices above, and a sky garden on top.",
    description:
      "Currently in design development. Landowners and investors interested in joint development are welcome to get in touch.",
    cover: { url: u("1582268611958-ebfd161ef9cf"), alt: "Modern high-rise rendering" },
    gallery: [],
    specs: [
      { label: "Use", value: "Retail + Office" },
      { label: "Stage", value: "Design development" },
    ],
    featured: true,
  }),
  p(6, {
    slug: "greenfield-farm-plots",
    title: "Greenfield Farm Plots",
    status: "upcoming",
    category: "Plotted development",
    location: "Gujarat",
    year: "2027",
    summary: "Gated weekend-home plots with planted avenues, water harvesting and ready infrastructure.",
    description: "Approvals in progress. Register interest for early allotment.",
    cover: { url: u("1503387762-592deb58ef4e"), alt: "Architectural plans on a table" },
    gallery: [],
    specs: [{ label: "Stage", value: "Approvals" }],
    featured: false,
  }),
];
