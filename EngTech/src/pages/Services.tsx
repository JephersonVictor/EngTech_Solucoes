import SiteLayout from "../layout";

export default function Services() {
  return (
    <SiteLayout>
      <main className="inner-page">
        <section className="page-intro page-shell">
          <p className="eyebrow">Serviços EngTech</p>
          <h1>Tecnologia aplicada ao que realmente importa.</h1>
          <p className="intro-text">Cada projeto parte de uma necessidade real e chega a uma solução simples de usar, bonita de ver e preparada para crescer.</p>
        </section>
        <section className="detail-grid page-shell">
          <article className="detail-card">
            <span className="service-number">01 / WEB</span>
            <h2>Desenvolvimento de sites</h2>
            <p>Criação de sites institucionais, páginas de venda e experiências digitais responsivas para apresentar seu negócio com clareza.</p>
            <ul><li>Design sob medida para sua marca</li><li>Experiência adaptada ao celular</li><li>Estrutura preparada para conversão</li></ul>
          </article>
          <article className="detail-card detail-card-featured">
            <span className="service-number">02 / AI</span>
            <h2>Agentes de inteligência artificial</h2>
            <p>Agentes pensados para responder, organizar, automatizar e apoiar o seu time em tarefas que consomem tempo.</p>
            <ul><li>Atendimento e respostas inteligentes</li><li>Automação de fluxos repetitivos</li><li>Integração com a rotina do negócio</li></ul>
          </article>
        </section>
        <section className="process-section page-shell">
          <div><p className="eyebrow">Como funciona</p><h2>Do primeiro rascunho ao próximo resultado.</h2></div>
          <div className="process-list">
            <div><strong>01</strong><span>Entender</span><p>Mapeamos objetivo, público e contexto.</p></div>
            <div><strong>02</strong><span>Construir</span><p>Transformamos a ideia em uma solução funcional.</p></div>
            <div><strong>03</strong><span>Evoluir</span><p>Medimos, ajustamos e abrimos espaço para crescer.</p></div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}