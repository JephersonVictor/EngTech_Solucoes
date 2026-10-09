const STORAGE_KEYS = {
    projects: "engtech_projects",
    messages: "engtech_messages",
    socials: "engtech_socials"
};

const DEFAULT_SOCIALS = {
    whatsapp: "https://wa.me/5535999582036",
    instagram: "https://instagram.com/engtech_solucoes",
    linkedin: "https://linkedin.com/company/engtech"
};

const ADMIN_PASSWORD_HASH = "2614003232f1813f171cbe578c18adc4beeda0742f9f3838a89ac54111d186d9";

function readStorage(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
        return fallback;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

async function hashText(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setupAdminAuth() {
    const login = document.querySelector("[data-admin-login]");
    const loginForm = document.querySelector("[data-admin-login-form]");
    const adminPage = document.querySelector("[data-admin-page]");
    if (!login || !loginForm || !adminPage) return;

    const authenticated = sessionStorage.getItem("engtech_admin_authenticated") === "true";
    login.hidden = authenticated;
    adminPage.hidden = !authenticated;
    if (authenticated) return;

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const feedback = loginForm.querySelector("[data-admin-login-feedback]");
        const password = new FormData(loginForm).get("password");
        let passwordHash;
        try {
            passwordHash = await hashText(password);
        } catch (error) {
            feedback.textContent = "Não foi possível validar o acesso. Abra o site por um servidor local.";
            return;
        }
        if (passwordHash !== ADMIN_PASSWORD_HASH) {
            feedback.textContent = "Senha incorreta.";
            return;
        }
        sessionStorage.setItem("engtech_admin_authenticated", "true");
        login.hidden = true;
        adminPage.hidden = false;
        loginForm.reset();
    });
}

function setupActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a").forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });
}

function setupRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }
}

function getSocials() {
    return { ...DEFAULT_SOCIALS, ...readStorage(STORAGE_KEYS.socials, {}) };
}

function applySocialLinks() {
    const socials = getSocials();
    document.querySelectorAll("[data-social-link]").forEach((link) => {
        const channel = link.dataset.socialLink;
        if (socials[channel]) link.href = socials[channel];
    });
    document.querySelectorAll("[data-social-input]").forEach((input) => {
        const channel = input.dataset.socialInput;
        if (socials[channel]) input.value = socials[channel];
    });
}

function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card project-custom reveal is-visible";
    card.dataset.category = project.category;
    const categoryLabel = project.category === "ai" ? "Agente de IA" : "Site personalizado";
    card.innerHTML = `<div class="project-visual visual-${project.category}"><span>PROJETO / NOVO</span><strong>${project.title}</strong><i></i></div><div class="project-copy"><span>${categoryLabel}</span><h2>${project.title}</h2><p>${project.description}</p></div>`;
    return card;
}

function renderStoredProjects() {
    const portfolioGrid = document.querySelector(".portfolio-grid");
    if (!portfolioGrid) return;
    readStorage(STORAGE_KEYS.projects, []).forEach((project) => {
        portfolioGrid.appendChild(createProjectCard(project));
    });
}

function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const projectCards = () => document.querySelectorAll("[data-category]");
    const emptyState = document.querySelector(".empty-state");
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
            let visibleProjects = 0;
            projectCards().forEach((card) => {
                const isVisible = filter === "all" || card.dataset.category === filter;
                card.hidden = !isVisible;
                if (isVisible) visibleProjects += 1;
            });
            if (emptyState) emptyState.hidden = visibleProjects > 0;
        });
    });
}

function setupPortfolioImagePreview() {
    const dialog = document.querySelector("[data-image-dialog]");
    const preview = dialog?.querySelector("[data-image-dialog-preview]");
    const caption = dialog?.querySelector("[data-image-dialog-caption]");
    if (!dialog || !preview || !caption) return;

    document.querySelectorAll("[data-preview-image]").forEach((button) => {
        button.addEventListener("click", () => {
            const image = button.querySelector("img");
            if (!image) return;
            preview.src = image.currentSrc || image.src;
            preview.alt = image.alt;
            caption.textContent = button.dataset.previewCaption || image.alt;
            dialog.showModal();
        });
    });

    dialog.querySelector("[data-image-close]")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        preview.removeAttribute("src");
        preview.alt = "";
        caption.textContent = "";
    });
}

function setupContactForm() {
    const contactForm = document.querySelector("[data-contact-form]");
    if (!contactForm) return;
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const messages = readStorage(STORAGE_KEYS.messages, []);
        messages.unshift({
            id: Date.now(),
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
            date: new Date().toLocaleString("pt-BR")
        });
        writeStorage(STORAGE_KEYS.messages, messages);
        const subject = encodeURIComponent(`Novo projeto - ${formData.get("name")}`);
        const body = encodeURIComponent(`Nome: ${formData.get("name")}\nE-mail: ${formData.get("email")}\n\nProjeto:\n${formData.get("message")}`);
        contactForm.querySelector(".form-feedback").textContent = "Mensagem registrada. Abrindo seu aplicativo de e-mail...";
        window.location.href = `mailto:contato@engtech.com?subject=${subject}&body=${body}`;
    });
}

function renderAdminProjects() {
    const projectList = document.querySelector("[data-admin-project-list]");
    const projectCount = document.querySelector("[data-project-count]");
    const projects = readStorage(STORAGE_KEYS.projects, []);
    if (projectCount) projectCount.textContent = projects.length + 3;
    if (!projectList) return;
    projectList.innerHTML = projects.length ? "" : "<p class=\"empty-state\">Nenhum projeto personalizado cadastrado ainda.</p>";
    projects.forEach((project) => {
        const item = document.createElement("div");
        item.className = "admin-project-item";
        item.innerHTML = `<div><strong>${project.title}</strong><span>${project.category === "ai" ? "Agente de IA" : "Site"}</span></div><button class="text-button" type="button" data-remove-project="${project.id}">Remover</button>`;
        projectList.appendChild(item);
    });
    projectList.querySelectorAll("[data-remove-project]").forEach((button) => {
        button.addEventListener("click", () => {
            const remaining = projects.filter((project) => String(project.id) !== button.dataset.removeProject);
            writeStorage(STORAGE_KEYS.projects, remaining);
            renderAdminProjects();
        });
    });
}

function setupAdminPanel() {
    const adminPage = document.querySelector("[data-admin-page]");
    if (!adminPage) return;
    const messageCount = document.querySelector("[data-message-count]");
    const messageList = document.querySelector("[data-message-list]");
    const messages = readStorage(STORAGE_KEYS.messages, []);
    if (messageCount) messageCount.textContent = messages.length;
    if (messageList && messages.length) {
        messageList.innerHTML = "";
        messages.forEach((message) => {
            const item = document.createElement("article");
            item.className = "message-item";
            item.innerHTML = `<div class="message-meta"><strong>${message.name}</strong><span>${message.date}</span></div><a href="mailto:${message.email}">${message.email}</a><p>${message.message}</p>`;
            messageList.appendChild(item);
        });
    }
    document.querySelector("[data-clear-messages]")?.addEventListener("click", () => {
        writeStorage(STORAGE_KEYS.messages, []);
        window.location.reload();
    });
    document.querySelector("[data-project-form]")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const projects = readStorage(STORAGE_KEYS.projects, []);
        projects.unshift({ id: Date.now(), title: formData.get("title"), category: formData.get("category"), description: formData.get("description") });
        writeStorage(STORAGE_KEYS.projects, projects);
        event.currentTarget.reset();
        document.querySelector("[data-project-feedback]").textContent = "Projeto adicionado ao portfólio.";
        renderAdminProjects();
    });
    document.querySelector("[data-save-socials]")?.addEventListener("click", () => {
        const socials = {};
        document.querySelectorAll("[data-social-input]").forEach((input) => { socials[input.dataset.socialInput] = input.value; });
        writeStorage(STORAGE_KEYS.socials, socials);
        document.querySelector("[data-social-feedback]").textContent = "Canais atualizados no site.";
    });
    renderAdminProjects();
}

document.addEventListener("DOMContentLoaded", () => {
    setupAdminAuth();
    setupActiveNavigation();
    setupRevealAnimations();
    applySocialLinks();
    renderStoredProjects();
    setupPortfolioFilters();
    setupPortfolioImagePreview();
    setupContactForm();
    setupAdminPanel();
});
