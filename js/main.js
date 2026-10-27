
// ==========================================
// Developer Portfolio - Navigation
// ==========================================

"use strict";

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const siteHeader = document.getElementById("site-header");

// Update the mobile menu and accessibility state.
function setMenuOpen(isOpen) {
    navLinks.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );
}

// Open or close when the menu button is clicked.
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("is-open");
    setMenuOpen(!isOpen);
});

// Close after the user selects a navigation link.
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        setMenuOpen(false);
    });
});

// Allow users to close the menu with Escape.
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        navLinks.classList.contains("is-open")
    ) {
        setMenuOpen(false);
        menuToggle.focus();
    }
});

// Close the menu when clicking outside the header.
document.addEventListener("click", (event) => {
    if (
        navLinks.classList.contains("is-open") &&
        !siteHeader.contains(event.target)
    ) {
        setMenuOpen(false);
    }
});

// Reset the menu when switching to desktop width.
const desktopQuery = window.matchMedia("(min-width: 901px)");

function handleDesktopChange(event) {
    if (event.matches) {
        setMenuOpen(false);
    }
}

desktopQuery.addEventListener("change", handleDesktopChange);

console.log("Portfolio navigation initialized successfully.");



// ==========================================
// STEP 6: FEATURED PROJECTS
// ==========================================

const projectsGrid = document.getElementById("projects-grid");
const projectsEmpty = document.getElementById("projects-empty");
const projectTemplate = document.getElementById(
    "project-card-template"
);

// Accept only valid public HTTPS links.
function getPublicUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    try {
        const url = new URL(value);

        if (url.protocol !== "https:") {
            return null;
        }

        if (url.username || url.password) {
            return null;
        }

        if (
            url.hostname === "localhost" ||
            url.hostname.endsWith(".localhost") ||
            url.hostname.endsWith(".local") ||
            url.hostname.endsWith(".internal") ||
            /^(?:127|10|192\.168)\./.test(url.hostname) ||
            /^172\.(?:1[6-9]|2\d|3[01])\./.test(url.hostname)
        ) {
            return null;
        }

        return url.href;
    } catch {
        return null;
    }
}

// Create a genuine external link.
function createProjectLink(label, url) {
    const validUrl = getPublicUrl(url);

    if (!validUrl) {
        return null;
    }

    const link = document.createElement("a");

    link.textContent = label + " ↗";
    link.href = validUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
}

// Verify mandatory project fields.
function isValidProject(project) {
    return (
        project &&
        typeof project.title === "string" &&
        project.title.trim() &&
        typeof project.problem === "string" &&
        project.problem.trim() &&
        typeof project.contribution === "string" &&
        project.contribution.trim() &&
        Array.isArray(project.features) &&
        project.features.length > 0 &&
        project.features.every(
            (feature) =>
                typeof feature === "string" &&
                feature.trim()
        ) &&
        Array.isArray(project.technologies) &&
        project.technologies.length > 0 &&
        project.technologies.every(
            (technology) =>
                typeof technology === "string" &&
                technology.trim()
        )
    );
}

// Create one card from the HTML template.
function createProjectCard(project) {
    const fragment = projectTemplate.content.cloneNode(true);

    const card = fragment.querySelector(".project-card");

    fragment.querySelector(".project-title").textContent =
        project.title;

    fragment.querySelector(".project-problem").textContent =
        project.problem;

    fragment.querySelector(".project-contribution").textContent =
        project.contribution;

    // Add implemented features.
    const featuresList = fragment.querySelector(
        ".project-features"
    );

    project.features.forEach((feature) => {
        const item = document.createElement("li");
        item.textContent = feature;
        featuresList.appendChild(item);
    });

    // Add technology badges.
    const technologies = fragment.querySelector(
        ".project-technologies"
    );

    project.technologies.forEach((technology) => {
        const badge = document.createElement("span");
        badge.textContent = technology;
        technologies.appendChild(badge);
    });

    // Add a local project screenshot if supplied.
    const imageWrapper = fragment.querySelector(
        ".project-image-wrapper"
    );

    if (
        typeof project.screenshot === "string" &&
        /^assets\/images\/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|webp)$/i
            .test(project.screenshot) &&
        !project.screenshot.split("/").includes("..")
    ) {
        const image = document.createElement("img");

        image.src = project.screenshot;
        image.alt = project.title + " project screenshot";
        image.loading = "lazy";

        image.addEventListener("load", () => {
            imageWrapper.replaceChildren(image);
        });

        // If the file is missing, keep the honest placeholder.
    }

    // Add only supplied, valid external URLs.
    const linksContainer = fragment.querySelector(
        ".project-links"
    );

    const githubLink = createProjectLink(
        "GitHub Repository",
        project.github
    );

    const demoLink = createProjectLink(
        "Live Demo",
        project.demo
    );

    if (githubLink) {
        linksContainer.appendChild(githubLink);
    }

    if (demoLink) {
        linksContainer.appendChild(demoLink);
    }

    // Don't leave an empty divider for missing links.
    if (!githubLink && !demoLink) {
        linksContainer.remove();
    }

    return card;
}

// Render all approved projects.
function renderProjects() {
    if (
        !projectsGrid ||
        !projectsEmpty ||
        !projectTemplate
    ) {
        console.error("Project section elements are missing.");
        return;
    }

    const projects = typeof portfolioProjects !== "undefined"
        ? portfolioProjects
        : [];

    if (!Array.isArray(projects)) {
        console.error("Project data must be an array.");
        return;
    }

    projectsGrid.replaceChildren();

    let renderedCount = 0;

    projects.forEach((project) => {
        if (!isValidProject(project)) {
            console.warn(
                "Skipped a project with incomplete data:",
                project?.id || "unknown"
            );
            return;
        }

        projectsGrid.appendChild(createProjectCard(project));
        renderedCount++;
    });

    projectsEmpty.hidden = renderedCount > 0;

    console.log(
        "Featured projects rendered:",
        renderedCount
    );
}

renderProjects();



// ==========================================
// STEP 8: CONTACT LINKS AND FOOTER
// ==========================================

const contactLinks = document.getElementById("contact-links");
const contactEmpty = document.getElementById("contact-empty");

// Validate email addresses for the mailto link.
function isValidEmail(email) {
    return (
        typeof email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        !/[\r\n?#]/.test(email)
    );
}

// Accept only HTTPS URLs for the expected profile host.
function getProfileUrl(value, allowedHosts) {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    try {
        const url = new URL(value.trim());

        const host = url.hostname.toLowerCase();

        if (
            url.protocol !== "https:" ||
            url.username ||
            url.password ||
            !allowedHosts.includes(host)
        ) {
            return null;
        }

        return url.href;
    } catch {
        return null;
    }
}

// Reusable contact-card creator.
function createContactCard(label, detail, url, symbol) {
    const link = document.createElement("a");
    link.className = "contact-card";
    link.href = url;

    if (!url.startsWith("mailto:")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }

    const icon = document.createElement("span");
    icon.className = "contact-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = symbol;

    const content = document.createElement("span");
    content.className = "contact-card-content";

    const title = document.createElement("span");
    title.className = "contact-card-title";
    title.textContent = label;

    const description = document.createElement("span");
    description.className = "contact-card-detail";
    description.textContent = detail;

    const arrow = document.createElement("span");
    arrow.className = "contact-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    content.append(title, description);
    link.append(icon, content, arrow);

    return link;
}

function renderContactLinks() {
    if (!contactLinks || !contactEmpty) {
        console.error("Contact section elements are missing.");
        return;
    }

    if (typeof portfolioContact === "undefined") {
        console.error("Contact configuration is missing.");
        return;
    }

    contactLinks.replaceChildren();

    const email = portfolioContact.email?.trim();

    if (isValidEmail(email)) {
        contactLinks.appendChild(
            createContactCard(
                "Email",
                email,
                "mailto:" + email,
                "@"
            )
        );
    }

    const linkedinUrl = getProfileUrl(
        portfolioContact.linkedin,
        ["linkedin.com", "www.linkedin.com"]
    );

    if (linkedinUrl) {
        contactLinks.appendChild(
            createContactCard(
                "LinkedIn",
                "View my LinkedIn profile",
                linkedinUrl,
                "in"
            )
        );
    }

    const githubUrl = getProfileUrl(
        portfolioContact.github,
        ["github.com", "www.github.com"]
    );

    if (githubUrl) {
        contactLinks.appendChild(
            createContactCard(
                "GitHub",
                "Explore my public repositories",
                githubUrl,
                "</>"
            )
        );
    }

    const linkCount = contactLinks.children.length;

    contactEmpty.hidden = linkCount > 0;

    console.log("Contact methods displayed:", linkCount);
}

// Automatically update the copyright year.
function updateFooterYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date()
            .getFullYear()
            .toString();
    }
}

renderContactLinks();
updateFooterYear();
