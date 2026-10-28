import type { ReactNode } from "react";

type SiteLayoutProps = {
  children: ReactNode;
  admin?: boolean;
  footerNote?: ReactNode;
};

const navigation = [
  ["index.html", "Início"],
  ["servicos.html", "Serviços"],
  ["portfolio.html", "Portfólio"],
  ["sobre.html", "Sobre"]
] as const;

export function SiteHeader({ admin = false }: { admin?: boolean }) {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  return (
    <header className="site-header">
      <a className="brand" href="index.html" aria-label="EngTech - início">
        <picture>
          <source srcSet="/logo-site.webp" type="image/webp" />
          <img src="/logo-site.png" alt="Logo EngTech" />
        </picture>
        <span>EngTech</span>
      </a>
      <nav className="main-nav" aria-label={admin ? "Navegação administrativa" : "Navegação principal"}>
        {admin ? (
          <>
            <a href="index.html">Ver site</a>
            <a href="portfolio.html">Portfólio</a>
            <a className="nav-cta" href="contato.html">Abrir contato</a>
          </>
        ) : (
          <>
            {navigation.map(([href, label]) => (
              <a href={href} aria-current={currentPage === href ? "page" : undefined} key={href}>
                {label}
              </a>
            ))}
            <a className="nav-cta" href="contato.html" aria-current={currentPage === "contato.html" ? "page" : undefined}>
              Vamos conversar
            </a>
          </>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter({ admin = false, footerNote }: Omit<SiteLayoutProps, "children">) {
  return (
    <footer className="site-footer">
      <span>EngTech Soluções em Tecnologia</span>
      <span>
        {footerNote ?? (admin ? (
          <>Painel local · <a href="index.html">Voltar ao site</a></>
        ) : (
          <>Desenvolvimento web &amp; agentes de IA · <a href="admin.html">Área administrativa</a></>
        ))}
      </span>
    </footer>
  );
}

export default function SiteLayout({ children, admin = false, footerNote }: SiteLayoutProps) {
  return <><SiteHeader admin={admin} />{children}<SiteFooter admin={admin} footerNote={footerNote} /></>;
}