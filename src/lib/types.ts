export type ProjectStatus = "completed" | "ongoing" | "upcoming";
export type Visibility = "published" | "draft" | "archived";

export interface ProjectImage {
  url: string;
  alt: string;
  /** Show full-width in the project gallery */
  wide?: boolean;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** Past / present / future */
  status: ProjectStatus;
  category: string;
  location: string;
  /** Free text: "2023", "2024 – 2026", "Launching 2027" */
  year: string;
  summary: string;
  description: string;
  cover: ProjectImage | null;
  gallery: ProjectImage[];
  specs: ProjectSpec[];
  featured: boolean;
  visibility: Visibility;
  /** Lower comes first */
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  project: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

export interface SiteSettings {
  ownerName: string;
  brandName: string;
  tagline: string;
  intro: string;
  about: string;
  email: string;
  phone: string;
  /** Digits with country code, e.g. 919876543210 */
  whatsapp: string;
  address: string;
  instagram: string;
  linkedin: string;
  heroImage: ProjectImage | null;
  portrait: ProjectImage | null;
  stats: ProjectSpec[];
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Under construction",
  upcoming: "Upcoming",
};

export const STATUS_TENSE: Record<ProjectStatus, string> = {
  completed: "Past",
  ongoing: "Present",
  upcoming: "Future",
};
