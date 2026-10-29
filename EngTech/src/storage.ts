export type ProjectCategory = "web" | "ai";

export type Project = {
  id: number;
  title: string;
  category: ProjectCategory;
  description: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
};

export const DEFAULT_SOCIALS = {
  whatsapp: "https://wa.me/5535999582036",
  instagram: "https://instagram.com/engtech_solucoes",
  linkedin: "https://linkedin.com/company/engtech"
};