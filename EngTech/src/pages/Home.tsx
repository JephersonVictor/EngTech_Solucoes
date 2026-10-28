import SiteLayout from "../layout";

export default function Home() {
  return (
    <SiteLayout>
      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <p className="eyebrow">Tecnologia que trabalha por você</p>
            <h1>Presença digital com inteligência e propósito.</h1>
            <p className="hero-text">Desenvolvo sites profissionais e agentes de IA que ajudam negócios a ganhar presença, agilidade e novas oportunidades.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="contato.html">Começar um projeto</a>
              <a className="button button-secondary" href="servicos.html">Conhecer serviços</a>
            </div>
          </div>
          <div className="hero-panel" aria-label="Especialidades EngTech">
            <span className="panel-label">Especialidades</span>
            <strong>Web + AI</strong>
            <p>Soluções digitais pensadas para simplificar o trabalho e gerar valor.</p>
            <div className="panel-line" />
            <span className="panel-status"><i /> Disponível para novos projetos</span>
          </div>
        </section>

        <section className="services section-shell" id="servicos">
          <div className="section-heading">
            <p className="eyebrow">O que eu faço</p>
            <h2>Soluções sob medida para a próxima fase do seu negócio.</h2>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <span className="service-number">01</span>
              <h3>Desenvolvimento de sites</h3>
              <p>Sites rápidos, responsivos e com uma presença visual à altura da sua marca.</p>
              <a href="servicos.html">Criar meu site <span aria-hidden="true">&#8594;</span></a>
            </article>
            <article className="service-card service-card-highlight">
              <span className="service-number">02</span>
              <h3>Agentes de inteligência artificial</h3>
              <p>Automação inteligente para atender, organizar informações e acelerar tarefas.</p>
              <a href="servicos.html">Explorar possibilidades <span aria-hidden="true">&#8594;</span></a>
            </article>
          </div>
        </section>

        <section className="portfolio-preview section-shell">
          <div className="section-heading portfolio-heading">
            <div>
              <p className="eyebrow">Projetos em movimento</p>
              <h2>Uma ideia bem construída muda a forma como uma marca é percebida.</h2>
            </div>
            <a className="text-link" href="portfolio.html">Ver portfólio <span aria-hidden="true">&#8594;</span></a>
          </div>
          <div className="preview-grid">
            <a className="preview-tile preview-tile-large" href="portfolio.html">
              <span>WEB / 01</span><strong>Experiências digitais que deixam uma impressão.</strong>
            </a>
            <a className="preview-tile preview-tile-small" href="portfolio.html">
              <span>AI / 02</span><strong>Automação que abre tempo para o que importa.</strong>
            </a>
          </div>
        </section>

        <section className="about section-shell" id="sobre">
          <div><p className="eyebrow">Por que EngTech</p><h2>Tecnologia clara, humana e feita para funcionar.</h2></div>
          <p>Meu trabalho combina design, desenvolvimento e inteligência artificial para transformar ideias em experiências digitais úteis, bonitas e eficientes.</p>
        </section>

        <section className="contact section-shell" id="contato">
          <p className="eyebrow">Pronto para tirar a ideia do papel?</p>
          <h2>Vamos construir algo que faça diferença.</h2>
          <a className="button button-primary" href="contato.html">Entrar em contato <span aria-hidden="true">&#8594;</span></a>
        </section>
      </main>
    </SiteLayout>
  );
}