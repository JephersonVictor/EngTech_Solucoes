import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const page = window.location.pathname.split("/").pop();
const pageTitles: Record<string, string> = {
  "index.html": "EngTech Soluções em Tecnologia",
  "servicos.html": "Serviços | EngTech",
  "portfolio.html": "Portfólio | EngTech",
  "sobre.html": "Sobre | EngTech",
  "contato.html": "Contato | EngTech",
  "admin.html": "Painel administrativo | EngTech"
};
document.title = pageTitles[page ?? ""] ?? pageTitles["index.html"];

const Page = lazy(() => {
  switch (page) {
    case "servicos.html": return import("./pages/Services");
    case "portfolio.html": return import("./pages/Portfolio");
    case "sobre.html": return import("./pages/About");
    case "contato.html": return import("./pages/Contact");
    case "admin.html": return import("./pages/Admin");
    default: return import("./pages/Home");
  }
});

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <Suspense fallback={<main className="page-shell" aria-live="polite">Carregando...</main>}>
      <Page />
    </Suspense>
  );
}