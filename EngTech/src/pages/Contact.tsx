import { useState, type FormEvent } from "react";
import SiteLayout from "../layout";
import { DEFAULT_SOCIALS, readStorage, STORAGE_KEYS, type ContactMessage } from "../storage";

const CONTACT_EMAIL = "jepherson.brc46@gmail.com";

export default function Contact() {
  const [feedback, setFeedback] = useState("");
  const socials = { ...DEFAULT_SOCIALS, ...readStorage<Partial<typeof DEFAULT_SOCIALS>>(STORAGE_KEYS.socials, {}) };

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const messages = readStorage<ContactMessage[]>(STORAGE_KEYS.messages, []);
    messages.unshift({ id: Date.now(), name, email, message, date: new Date().toLocaleString("pt-BR") });
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    const subject = encodeURIComponent(`Novo projeto - ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nProjeto:\n${message}`);
    setFeedback("Mensagem registrada. Abrindo seu aplicativo de e-mail...");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <SiteLayout>
      <main className="inner-page">
        <section className="contact-page page-shell">
          <div className="contact-copy">
            <p className="eyebrow">Contato</p>
            <h1>Tem uma ideia? Vamos dar um primeiro passo.</h1>
            <p>Conte um pouco sobre o seu desafio. Eu retorno com perguntas, possibilidades e um caminho inicial para o projeto.</p>
            <a className="direct-contact" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span aria-hidden="true">&#8594;</span></a>
            <div className="contact-channels">
              <a href={socials.whatsapp} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">&#8599;</span></a>
              <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">&#8599;</span></a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">&#8599;</span></a>
            </div>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="name">Seu nome</label>
            <input id="name" name="name" type="text" placeholder="Como posso te chamar?" required />
            <label htmlFor="email">Seu e-mail</label>
            <input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
            <label htmlFor="message">Sobre o projeto</label>
            <textarea id="message" name="message" rows={5} placeholder="O que você quer construir?" required />
            <button className="button button-primary" type="submit">Preparar mensagem <span aria-hidden="true">&#8594;</span></button>
            <p className="form-feedback" role="status" aria-live="polite">{feedback}</p>
          </form>
        </section>
      </main>
    </SiteLayout>
  );
}