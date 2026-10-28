import SiteLayout from "../layout";

export default function About() {
  return (
    <SiteLayout>
      <main className="inner-page">
        <section className="page-intro page-shell">
          <p className="eyebrow">Sobre a EngTech</p>
          <h1>Construir tecnologia também é construir confiança.</h1>
          <p className="intro-text">A EngTech nasceu para aproximar negócios das ferramentas digitais que tornam o trabalho mais simples, relevante e preparado para o amanhã.</p>
        </section>
        <section className="manifesto page-shell">
          <div className="manifesto-mark">E<span>/</span>T</div>
          <div>
            <p className="eyebrow">Um jeito diferente de fazer</p>
            <h2>Menos complexidade. Mais intenção.</h2>
            <p>Todo projeto começa com escuta e termina com uma solução que faz sentido no dia a dia. A tecnologia entra como meio: para comunicar melhor, automatizar o que pesa e liberar espaço para o que só pessoas podem fazer.</p>
          </div>
        </section>
        <section className="values-grid page-shell">
          <article><span>01</span><h2>Clareza</h2><p>Decisões compreensíveis, processos transparentes e interfaces que não exigem manual.</p></article>
          <article><span>02</span><h2>Precisão</h2><p>Detalhes bem resolvidos para que cada parte da experiência tenha uma razão de existir.</p></article>
          <article><span>03</span><h2>Parceria</h2><p>Construção próxima, com espaço para trocar, testar e evoluir com segurança.</p></article>
        </section>
      </main>
    </SiteLayout>
  );
}