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

export const STORAGE_KEYS = {
  projects: "engtech_projects",
  messages: "engtech_messages",
  socials: "engtech_socials"
} as const;

export const DEFAULT_SOCIALS = {
  whatsapp: "https://wa.me/5535999582036",
  instagram: "https://instagram.com/engtech_solucoes",
  linkedin: "https://linkedin.com/company/engtech"
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}