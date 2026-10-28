import { useState, type FormEvent } from "react";
import SiteLayout from "../layout";
import {
  DEFAULT_SOCIALS,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
  type ContactMessage,
  type Project,
  type ProjectCategory
} from "../storage";

const ADMIN_PASSWORD_HASH = "2614003232f1813f171cbe578c18adc4beeda0742f9f3838a89ac54111d186d9";

async function hashText(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(sessionStorage.getItem("engtech_admin_authenticated") === "true");
  const [loginFeedback, setLoginFeedback] = useState("");
  const [projectFeedback, setProjectFeedback] = useState("");
  const [socialFeedback, setSocialFeedback] = useState("");
  const [projects, setProjects] = useState(() => readStorage<Project[]>(STORAGE_KEYS.projects, []));
  const [messages, setMessages] = useState(() => readStorage<ContactMessage[]>(STORAGE_KEYS.messages, []));
  const [socials, setSocials] = useState(() => ({
    ...DEFAULT_SOCIALS,
    ...readStorage<Partial<typeof DEFAULT_SOCIALS>>(STORAGE_KEYS.socials, {})
  }));

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = String(new FormData(form).get("password") ?? "");
    try {
      if (await hashText(password) !== ADMIN_PASSWORD_HASH) {
        setLoginFeedback("Senha incorreta.");
        return;
      }
    } catch {
      setLoginFeedback("Não foi possível validar o acesso. Abra o site por um servidor local.");
      return;
    }
    sessionStorage.setItem("engtech_admin_authenticated", "true");
    setAuthenticated(true);
    setLoginFeedback("");
    form.reset();
  }

  function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextProjects: Project[] = [{
      id: Date.now(),
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category")) as ProjectCategory,
      description: String(formData.get("description") ?? "")
    }, ...projects];
    writeStorage(STORAGE_KEYS.projects, nextProjects);
    setProjects(nextProjects);
    setProjectFeedback("Projeto adicionado ao portfólio.");
    form.reset();
  }

  function removeProject(id: number) {
    const nextProjects = projects.filter((project) => project.id !== id);
    writeStorage(STORAGE_KEYS.projects, nextProjects);
    setProjects(nextProjects);
  }

  function saveSocials() {
    writeStorage(STORAGE_KEYS.socials, socials);
    setSocialFeedback("Canais atualizados no site.");
  }

  function clearMessages() {
    writeStorage(STORAGE_KEYS.messages, []);
    setMessages([]);
  }

  return (
    <SiteLayout admin>
      {!authenticated ? (
        <section className="admin-login" aria-labelledby="admin-login-title">
          <p className="eyebrow">Acesso restrito</p>
          <h1 id="admin-login-title">Entrar no painel</h1>
          <p>Informe a senha para acessar as ferramentas administrativas.</p>
          <form className="admin-login-form" onSubmit={submitLogin}>
            <label htmlFor="admin-password">Senha</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
            <button className="button button-primary" type="submit">Entrar</button>
            <p className="form-feedback" role="alert" aria-live="polite">{loginFeedback}</p>
          </form>
        </section>
      ) : (
        <main className="admin-main">
          <section className="admin-heading">
            <div>
              <p className="eyebrow">Área administrativa</p>
              <h1>Organize sua presença digital.</h1>
              <p>Gerencie projetos do portfólio, acompanhe mensagens e mantenha seus canais de contato acessíveis.</p>
            </div>
            <div className="admin-status"><i /><span>Painel local ativo</span></div>
          </section>

          <section className="admin-stats" aria-label="Resumo do painel">
            <article><span>Projetos publicados</span><strong>{projects.length + 3}</strong></article>
            <article><span>Mensagens recebidas</span><strong>{messages.length}</strong></article>
            <article><span>Canal principal</span><strong>WhatsApp</strong></article>
          </section>

          <section className="admin-grid">
            <div className="admin-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">Portfólio</p><h2>Novo projeto</h2></div>
                <span className="panel-code">CMS / 01</span>
              </div>
              <form className="admin-form" onSubmit={submitProject}>
                <label htmlFor="project-title">Nome do projeto</label>
                <input id="project-title" name="title" type="text" placeholder="Ex.: Site da minha empresa" required />
                <label htmlFor="project-category">Categoria</label>
                <select id="project-category" name="category" defaultValue="web">
                  <option value="web">Site</option>
                  <option value="ai">Agente de IA</option>
                </select>
                <label htmlFor="project-description">Descrição</label>
                <textarea id="project-description" name="description" rows={4} placeholder="Explique em uma frase o que foi desenvolvido." required />
                <button className="button button-primary" type="submit">Adicionar ao portfólio <span aria-hidden="true">&#8594;</span></button>
                <p className="form-feedback" role="status" aria-live="polite">{projectFeedback}</p>
              </form>
              <div className="admin-project-list">
                {projects.length === 0 ? <p className="empty-state">Nenhum projeto personalizado cadastrado ainda.</p> : projects.map((project) => (
                  <div className="admin-project-item" key={project.id}>
                    <div><strong>{project.title}</strong><span>{project.category === "ai" ? "Agente de IA" : "Site"}</span></div>
                    <button className="text-button" type="button" onClick={() => removeProject(project.id)}>Remover</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">Canais</p><h2>Seus contatos</h2></div>
                <span className="panel-code">LINKS / 02</span>
              </div>
              <div className="social-manager">
                <label htmlFor="whatsapp-link">WhatsApp</label>
                <input id="whatsapp-link" type="url" value={socials.whatsapp} onChange={(event) => setSocials({ ...socials, whatsapp: event.target.value })} />
                <label htmlFor="instagram-link">Instagram</label>
                <input id="instagram-link" type="url" value={socials.instagram} onChange={(event) => setSocials({ ...socials, instagram: event.target.value })} />
                <label htmlFor="linkedin-link">LinkedIn</label>
                <input id="linkedin-link" type="url" value={socials.linkedin} onChange={(event) => setSocials({ ...socials, linkedin: event.target.value })} />
                <button className="button button-secondary" type="button" onClick={saveSocials}>Salvar canais</button>
                <p className="form-feedback" role="status" aria-live="polite">{socialFeedback}</p>
              </div>
            </div>
          </section>

          <section className="admin-panel messages-panel">
            <div className="panel-heading">
              <div><p className="eyebrow">Caixa de entrada</p><h2>Mensagens de clientes</h2></div>
              <button className="text-button" type="button" onClick={clearMessages}>Limpar mensagens</button>
            </div>
            <div className="message-list">
              {messages.length === 0 ? <p className="empty-state">As mensagens enviadas pelo formulário aparecerão aqui.</p> : messages.map((message) => (
                <article className="message-item" key={message.id}>
                  <div className="message-meta"><strong>{message.name}</strong><span>{message.date}</span></div>
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                  <p>{message.message}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}
    </SiteLayout>
  );
}