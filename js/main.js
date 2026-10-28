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



// ==========================================
// Featured projects
// ==========================================

const projectsGrid = document.getElementById("projects-grid");
const projectsEmpty = document.getElementById("projects-empty");
const projectTemplate = document.getElementById(
    "project-card-template"
);

// Accept only valid HTTPS links.
function getPublicUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" ? url.href : null;
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

    const hint = document.createElement("span");
    hint.className = "visually-hidden";
    hint.textContent = " (opens in a new tab)";

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = " ↗";

    link.append(label, hint, arrow);
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

        const placeholder = imageWrapper.firstElementChild;

        image.src = project.screenshot;
        image.alt = project.title + " project screenshot";
        image.loading = "lazy";
        image.width = 1280;
        image.height = 720;

        // If the file is missing, restore the honest placeholder.
        image.addEventListener("error", () => {
            image.replaceWith(placeholder);
        });

        imageWrapper.replaceChildren(image);
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
}

renderProjects();



// ==========================================
// Footer
// ==========================================

// Automatically update the copyright year.
function updateFooterYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date()
            .getFullYear()
            .toString();
    }
}

updateFooterYear();
