import fs from "fs";
import path from "path";

const sanitizeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getImageUrl = (imageObj) => {
  if (typeof imageObj?.url === "string" && imageObj.url.trim()) {
    return imageObj.url;
  }
  return "/placeholder.jpg";
};

const getColorValue = (color) => {
  if (typeof color === "string" && color.trim() && color !== "undefined") {
    return color;
  }
  return "#6366f1";
};

const getPrimaryColor = (data) => {
  const color = data?.theme?.primaryColor || data?.color || "#6366f1";
  return getColorValue(color);
};

const normalizeBackground = (background, primaryColor) => {
  if (!background) {
    return "#020617";
  }
  const value = String(background).trim().toLowerCase();
  if (value.startsWith("#") || value.startsWith("rgb") || value.startsWith("linear-gradient")) {
    return background;
  }

  const primary = primaryColor ? primaryColor.replace(/\s/g, "") : "#6366f1";
  const defaultGradient = `linear-gradient(135deg, ${primary}20 0%, rgba(15,23,42,0.95) 35%, rgba(2,6,23,1) 100%)`;

  switch (value) {
    case "gradient":
      return defaultGradient;
    case "dark":
      return "#020617";
    case "light":
      return "#f8fafc";
    case "grass":
      return "linear-gradient(135deg, #0f766e 0%, #22c55e 45%, #bef264 100%)";
    case "warm":
      return "linear-gradient(135deg, #7c2d12 0%, #f97316 45%, #fde68a 100%)";
    case "cool":
      return "linear-gradient(135deg, #0f172a 0%, #0ea5e9 45%, #38bdf8 100%)";
    case "glass":
      return "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))";
    default:
      return background;
  }
};

const isLightBackground = (background) => {
  const value = String(background || "").trim().toLowerCase();
  if (!value) return false;
  if (value.startsWith("#")) {
    const cleaned = value.replace(/[^0-9a-f]/gi, "");
    if (cleaned.length === 3) {
      const [r, g, b] = cleaned.split("");
      const rgb = [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
      return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.8;
    }
    if (cleaned.length === 6) {
      const rgb = [
        parseInt(cleaned.slice(0, 2), 16),
        parseInt(cleaned.slice(2, 4), 16),
        parseInt(cleaned.slice(4, 6), 16),
      ];
      return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.8;
    }
  }
  if (value.startsWith("rgb")) {
    const numbers = value.match(/\d+/g)?.map(Number);
    if (numbers?.length >= 3) {
      const [r, g, b] = numbers;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.8;
    }
  }
  return ["light", "glass", "warm"].some((item) => value.includes(item));
};

const getThemeStyleValues = (data, primaryColor) => {
  const background = normalizeBackground(data?.theme?.background || data?.background || "gradient", primaryColor);
  const light = isLightBackground(data?.theme?.background || data?.background || "") || String(data?.theme?.style || "").toLowerCase().includes("light");
  if (light) {
    return {
      background,
      textColor: "#0f172a",
      mutedColor: "#475569",
      surfaceBg: "rgba(255, 255, 255, 0.92)",
      surfaceBorder: "rgba(148, 163, 184, 0.16)",
      headerBg: "rgba(255, 255, 255, 0.9)",
      navLink: "#475569",
      navHover: "#0f172a",
      buttonText: "#0f172a",
    };
  }
  return {
    background,
    textColor: "#f8fafc",
    mutedColor: "#cbd5e1",
    surfaceBg: "rgba(15, 23, 42, 0.78)",
    surfaceBorder: "rgba(255, 255, 255, 0.08)",
    headerBg: "rgba(15, 23, 42, 0.85)",
    navLink: "#cbd5e1",
    navHover: "#f8fafc",
    buttonText: "#ffffff",
  };
};

export async function generateHTMLProject(data, outputDir) {
  try {
    // Create folder structure
    fs.mkdirSync(outputDir, { recursive: true });

    const primaryColor = getPrimaryColor(data);
    const themeStyles = getThemeStyleValues(data, primaryColor);
    const bgStyle = themeStyles.background;
    const heroImg = getImageUrl(data?.hero?.image);

    // Normalize section data
    const sections = data?.sections || {};
    const rootSections = {
      about: sections.about || data?.about,
      features: sections.features || data?.features || [],
      projects: sections.projects || data?.projects || [],
      testimonials: sections.testimonials || data?.testimonials || [],
      contact: sections.contact || data?.contact,
    };

    // Generate CSS
    const css = `
:root {
  --primary: ${primaryColor};
  --text: ${themeStyles.textColor};
  --muted: ${themeStyles.mutedColor};
  --bg: ${bgStyle};
  --surface-bg: ${themeStyles.surfaceBg};
  --surface-border: ${themeStyles.surfaceBorder};
  --header-bg: ${themeStyles.headerBg};
  --nav-link: ${themeStyles.navLink};
  --nav-hover: ${themeStyles.navHover};
  --button-text: ${themeStyles.buttonText};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--bg, #020617);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg, #020617);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
  padding: 140px 32px 90px;
}

.hero-content {
  max-width: 680px;
  padding-right: 32px;
}

.hero-image {
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  aspect-ratio: 4/3;
  padding: 24px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4.2rem);
  margin-bottom: 16px;
  line-height: 1.05;
}

.hero-content p {
  font-size: 1rem;
  color: var(--muted);
  margin-bottom: 32px;
  line-height: 1.85;
}

.hero-image {
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  padding: 24px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 16px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-item {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.75s ease, transform 0.75s ease;
}

.animate-item.visible {
  opacity: 1;
  transform: translateY(0);
}

header {
  border-bottom: 1px solid var(--surface-border);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--header-bg);
  backdrop-filter: blur(10px);
}

nav a {
  color: var(--nav-link);
}

nav a:hover {
  color: var(--nav-hover);
}

.cta-btn {
  background: var(--primary);
  color: var(--button-text);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}

nav ul {
  display: flex;
  list-style: none;
  gap: 32px;
  align-items: center;
}

nav a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.3s;
}

nav a:hover {
  color: var(--text);
}

.cta-btn {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.3s;
}

.cta-btn:hover {
  opacity: 0.9;
}

section {
  padding: 80px 0;
}

section h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

section p {
  color: var(--muted);
  margin-bottom: 32px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-content p {
  font-size: 18px;
  color: var(--muted);
  margin-bottom: 32px;
}

.hero-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.card {
  padding: 32px;
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  background: var(--surface-bg);
}

.card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.card p {
  color: var(--muted);
  font-size: 14px;
}

.testimonial {
  padding: 32px;
  border-radius: 12px;
  background: var(--surface-bg);
  border: 1px solid var(--surface-border);
}

.testimonial-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 14px;
}

.testimonial-info h4 {
  font-size: 14px;
  font-weight: 600;
}

.testimonial-info p {
  font-size: 12px;
  color: var(--muted);
}

.testimonial-content {
  color: var(--muted);
  font-style: italic;
}

.contact-form {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  max-width: 500px;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  background: var(--surface-bg);
  color: var(--text);
  font-size: 14px;
}

input::placeholder {
  color: var(--muted);
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0;
  margin-top: 80px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
  
  nav ul {
    flex-direction: column;
    gap: 12px;
    display: none;
  }
  
  section h2 {
    font-size: 24px;
  }
  
  .hero-content h1 {
    font-size: 32px;
  }
  
  .contact-form {
    flex-direction: column;
  }
}
`;

    // Build HTML content
    const navLinks = (data?.navbar?.links || [])
      .map((link) => `<li><a href="${sanitizeHtml(link.href)}">${sanitizeHtml(link.label)}</a></li>`)
      .join("");

    const featuresHtml = (rootSections.features || [])
      .map(
        (f) => `
      <div class="card animate-item">
        <h3>${sanitizeHtml(f.title)}</h3>
        <p>${sanitizeHtml(f.description)}</p>
      </div>
    `
      )
      .join("");

    const projectsHtml = (rootSections.projects || [])
      .map(
        (p) => `
      <div class="card animate-item">
        <h3>${sanitizeHtml(p.title)}</h3>
        <p>${sanitizeHtml(p.description)}</p>
      </div>
    `
      )
      .join("");

    const testimonialsHtml = (rootSections.testimonials || [])
      .slice(0, 3)
      .map((t) => {
        const initials = (t.name || "?")
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return `
        <div class="testimonial animate-item">
          <div class="testimonial-header">
            <div class="avatar">${initials}</div>
            <div class="testimonial-info">
              <h4>${sanitizeHtml(t.name)}</h4>
              <p>${sanitizeHtml(t.role)}</p>
            </div>
          </div>
          <p class="testimonial-content">"${sanitizeHtml(t.content)}"</p>
        </div>
      `;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizeHtml(data?.navbar?.logo?.text || "Landing Page")}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">${sanitizeHtml(data?.navbar?.logo?.text || "Logo")}</div>
      <ul>
        ${navLinks}
      </ul>
      <button class="cta-btn">${sanitizeHtml(data?.navbar?.ctaButton?.text || "Get Started")}</button>
    </nav>
  </header>

  <main>
    <!-- Hero -->
    <section id="hero" class="hero animate-item" style="padding-top: 80px;">
      <div class="hero-content">
        <h1>${sanitizeHtml(data?.hero?.title || "Welcome")}</h1>
        <p>${sanitizeHtml(data?.hero?.subtitle || "")}</p>
        <button class="cta-btn">${sanitizeHtml(data?.hero?.cta || "Get Started")}</button>
      </div>
      <div class="hero-image">
        <img src="${sanitizeHtml(heroImg)}" alt="${sanitizeHtml(data?.hero?.image?.alt || "Hero image")}" />
      </div>
    </section>

    <!-- Features -->
    ${
      rootSections.features?.length > 0
        ? `
    <section id="features" class="animate-item">
      <div class="container">
        <h2>Features</h2>
        <div class="grid">
          ${featuresHtml}
        </div>
      </div>
    </section>
    `
        : ""
    }

    <!-- Projects -->
    ${
      rootSections.projects?.length > 0
        ? `
    <section id="projects" class="animate-item">
      <div class="container">
        <h2>Projects</h2>
        <div class="grid">
          ${projectsHtml}
        </div>
      </div>
    </section>
    `
        : ""
    }

    <!-- About -->
    ${
      rootSections.about?.title
        ? `
    <section id="about" class="animate-item">
      <div class="container">
        <h2>${sanitizeHtml(rootSections.about.title)}</h2>
        <p>${sanitizeHtml(rootSections.about.description)}</p>
      </div>
    </section>
    `
        : ""
    }

    <!-- Testimonials -->
    ${
      rootSections.testimonials?.length > 0
        ? `
    <section id="testimonials" class="animate-item">
      <div class="container">
        <h2>Testimonials</h2>
        <div class="grid">
          ${testimonialsHtml}
        </div>
      </div>
    </section>
    `
        : ""
    }

    <!-- Contact -->
    ${
      rootSections.contact?.title
        ? `
    <section id="contact" class="animate-item">
      <div class="container">
        <h2>${sanitizeHtml(rootSections.contact.title)}</h2>
        <p>${sanitizeHtml(rootSections.contact.description || "Get in touch")}</p>
        <form class="contact-form animate-item">
          <input type="email" placeholder="${sanitizeHtml(rootSections.contact.emailPlaceholder || "your@email.com")}" />
          <button type="submit" class="cta-btn">${sanitizeHtml(rootSections.contact.buttonText || "Send")}</button>
        </form>
      </div>
    </section>
    `
        : ""
    }
  </main>

  <footer>
    <div class="container">
      <p>${sanitizeHtml(data?.footer?.text || "© 2024 All rights reserved")}</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

    // Write files
    fs.writeFileSync(path.join(outputDir, "index.html"), html);
    fs.writeFileSync(path.join(outputDir, "style.css"), css);
    fs.writeFileSync(
      path.join(outputDir, "script.js"),
      `document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your interest!');
      this.reset();
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  document.querySelectorAll('.animate-item').forEach((el) => {
    observer.observe(el);
  });
});`
    );

    return outputDir;
  } catch (error) {
    console.error("HTML generation error:", error);
    throw new Error(`Failed to generate HTML project: ${error.message}`);
  }
}
