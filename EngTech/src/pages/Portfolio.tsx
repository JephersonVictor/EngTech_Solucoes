import { useEffect, useRef, useState } from "react";
import SiteLayout from "../layout";
import { apiRequest } from "../api";
import type { Project, ProjectCategory } from "../storage";

type PortfolioItem = Project & { label: string; visual?: string; featured?: boolean };
type PreviewImage = { src: string; alt: string; caption: string; fallbackSrc?: string };

const builtInProjects: PortfolioItem[] = [
  { id: 1, title: "Power Fit", category: "web", description: "Site para academia com páginas de modalidades, planos, área do aluno e atendimento.", label: "Site institucional", featured: true },
  { id: 2, title: "Flow Studio", category: "web", description: "Dashboard para equipes acompanharem projetos com mais clareza.", label: "Interface web", visual: "dashboard" },
  { id: 3, title: "Nexo Assist", category: "ai", description: "Assistente inteligente para atendimento e triagem de solicitações.", label: "Agente de IA", visual: "agent" },
  { id: 4, title: "Ateliê Norte", category: "web", description: "Presença digital editorial para uma marca autoral e contemporânea.", label: "Site institucional", visual: "brand" }
];

function ProjectCard({ project, onPreview }: { project: PortfolioItem; onPreview: (image: PreviewImage) => void }) {
  return (
    <article className={`project-card project-${project.category}`} data-category={project.category}>
      {project.featured ? (
        <div className="project-visual visual-powerfit">
          <div className="powerfit-preview" aria-label="Imagens do site Power Fit">
            <button className="powerfit-image-trigger" type="button" onClick={() => onPreview({ src: "/powerfit-fullpage.webp", fallbackSrc: "/powerfit-fullpage.png", alt: "Captura da página completa do site Power Fit", caption: "Página inicial completa do site Power Fit" })} aria-label="Visualizar página completa do site Power Fit">
              <picture>
                <source srcSet="/powerfit-fullpage.webp" type="image/webp" />
                <img src="/powerfit-fullpage.png" alt="Captura da página completa do site Power Fit" loading="lazy" />
              </picture>
            </button>
            <button className="powerfit-image-trigger" type="button" onClick={() => onPreview({ src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", alt: "Estrutura da academia Power Fit", caption: "Estrutura da academia Power Fit" })} aria-label="Ampliar imagem: estrutura da academia">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" alt="Estrutura da academia Power Fit" loading="lazy" />
            </button>
            <button className="powerfit-image-trigger" type="button" onClick={() => onPreview({ src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80", alt: "Treino com kettlebell no site Power Fit", caption: "Treino com kettlebell no site Power Fit" })} aria-label="Ampliar imagem: treino com kettlebell">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" alt="Treino com kettlebell no site Power Fit" loading="lazy" />
            </button>
          </div>
          <span className="powerfit-label">POWER FIT / SITE INSTITUCIONAL</span>
          <span className="powerfit-note">Projeto desenvolvido · não publicado</span>
        </div>
      ) : (
        <div className={`project-visual ${project.visual ? `visual-${project.visual}` : `visual-${project.category}`}`}>
          <span>{project.visual === "dashboard" ? "FLOW / 01" : project.visual === "agent" ? "AGENT / 02" : project.visual === "brand" ? "BRAND / 03" : "PROJETO / NOVO"}</span>
          <strong>{project.visual === "dashboard" ? "Organize o trabalho." : project.visual === "agent" ? "Respostas que avançam." : project.visual === "brand" ? "Marcas que ficam." : project.title}</strong>
          <i />
        </div>
      )}
      <div className="project-copy"><span>{project.label}</span><h2>{project.title}</h2><p>{project.description}</p></div>
    </article>
  );
}

function ImageDialog({ image, onClose }: { image: PreviewImage | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (image && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [image]);

  if (!image) return null;

  return (
    <dialog className="portfolio-lightbox" ref={dialogRef} aria-label="Imagem ampliada do projeto" onClose={onClose} onClick={(event) => {
      if (event.target === event.currentTarget) dialogRef.current?.close();
    }}>
      <button className="lightbox-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Fechar imagem ampliada">&times;</button>
      <figure>
        <picture>
          {image.fallbackSrc && <source srcSet={image.src} type="image/webp" />}
          <img src={image.fallbackSrc ?? image.src} alt={image.alt} />
        </picture>
        <figcaption>{image.caption}</figcaption>
      </figure>
    </dialog>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const [preview, setPreview] = useState<PreviewImage | null>(null);
  const [storedProjects, setStoredProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiRequest<Project[]>("/projects").then(setStoredProjects).catch(() => setStoredProjects([]));
  }, []);

  const customProjects = storedProjects.map((project) => ({
    ...project,
    label: project.category === "ai" ? "Agente de IA" : "Site personalizado"
  }));
  const projects = [...builtInProjects, ...customProjects];
  const visibleProjects = projects.filter((project) => filter === "all" || project.category === filter);

  return (
    <SiteLayout footerNote="Desenvolvimento web e agentes de IA">
      <main className="inner-page">
        <section className="page-intro page-shell">
          <p className="eyebrow">Portfólio EngTech</p>
          <h1>Ideias digitais com forma, função e futuro.</h1>
          <p className="intro-text">Uma seleção de conceitos que traduzem o tipo de experiência que posso criar para sua marca.</p>
        </section>
        <section className="portfolio-area page-shell">
          <div className="filter-bar" aria-label="Filtrar portfólio">
            {([["all", "Todos"], ["web", "Sites"], ["ai", "Agentes de IA"]] as const).map(([value, label]) => (
              <button className={`filter-button${filter === value ? " is-active" : ""}`} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} key={value}>{label}</button>
            ))}
          </div>
          <div className="portfolio-grid">
            {visibleProjects.map((project) => <ProjectCard project={project} onPreview={setPreview} key={project.id} />)}
          </div>
          {visibleProjects.length === 0 && <p className="empty-state">Nenhum projeto encontrado nessa categoria.</p>}
        </section>
      </main>
      <ImageDialog image={preview} onClose={() => setPreview(null)} />
    </SiteLayout>
  );
}