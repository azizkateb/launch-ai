import fs from "fs";
import path from "path";

const getImageUrl = (imageObj) => {
  if (typeof imageObj?.url === "string" && imageObj.url.trim()) {
    return imageObj.url;
  }
  return "/placeholder.jpg";
};

const getPrimaryColor = (data) => {
  const color = data?.theme?.primaryColor || data?.color || "#6366f1";
  return color && color !== "undefined" ? color : "#6366f1";
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

export async function generateReactProject(data, outputDir) {
  try {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(path.join(outputDir, "src", "components"), { recursive: true });

    const primaryColor = getPrimaryColor(data);
    const heroImg = getImageUrl(data?.hero?.image);

    // Normalize sections
    const sections = data?.sections || {};
    const rootSections = {
      about: sections.about || data?.about,
      features: sections.features || data?.features || [],
      projects: sections.projects || data?.projects || [],
      testimonials: sections.testimonials || data?.testimonials || [],
      contact: sections.contact || data?.contact,
    };

    // Create package.json
    const packageJson = {
      name: "landing-page",
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "framer-motion": "^10.16.4",
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.0.0",
        vite: "^4.3.9",
      },
    };

    // App component
    const appJsx = `import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const animationLevel = window.__DATA__.design?.animationLevel || 'subtle';
  
  return (
    <div className="app">
      <Navbar data={window.__DATA__.navbar} />
      <main>
        <Hero data={window.__DATA__.hero} animationLevel={animationLevel} />
        ${rootSections.features?.length > 0 ? "<Features data={window.__DATA__.features} animationLevel={animationLevel} />" : ""}
        ${rootSections.projects?.length > 0 ? "<Projects data={window.__DATA__.projects} animationLevel={animationLevel} />" : ""}
        ${rootSections.about ? "<About data={window.__DATA__.about} animationLevel={animationLevel} />" : ""}
        ${rootSections.testimonials?.length > 0 ? "<Testimonials data={window.__DATA__.testimonials} animationLevel={animationLevel} />" : ""}
        ${rootSections.contact ? "<Contact data={window.__DATA__.contact} animationLevel={animationLevel} />" : ""}
      </main>
      <Footer data={window.__DATA__.footer} />
    </div>
  );
}

export default App;`;

    const navbarJsx = `import React from 'react';

export default function Navbar({ data }) {
  return (
    <header className="navbar">
      <nav className="nav-inner">
        <div className="nav-brand">
          <div className="nav-icon">✨</div>
          <div className="logo">\${data?.logo?.text || 'LaunchAI'}</div>
        </div>
        <ul className="nav-links">
          \${data?.links?.map((link) => (
            <li key={link.href}>
              <a href={link.href}>\${link.label}</a>
            </li>
          ))}
        </ul>
        <button className="cta-btn">\${data?.ctaButton?.text || 'Generate Website'}</button>
      </nav>
    </header>
  );
}`;

    const heroJsx = `import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ data, animationLevel = 'subtle' }) {
  const getAnimationVariants = () => {
    if (animationLevel === 'none') return {};
    if (animationLevel === 'dynamic') return {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.8 },
    };
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    };
  };

  return (
    <motion.section 
      id="hero" 
      className="hero"
      {...getAnimationVariants()}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="hero-background">
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <div className="hero-layout">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="hero-badge">LaunchAI 2.0 is live</div>
          <h1>
            <span className="hero-title-light">Design to </span>
            <span className="text-gradient-primary">launch</span>
            <br />
            <span className="hero-title-light">in seconds.</span>
          </h1>
          <p>\${data?.subtitle || 'Describe your startup and generate a premium React codebase instantly.'}</p>
          <div className="hero-actions">
            <button className="cta-btn">\${data?.cta || 'Start Generating'}</button>
            <button className="cta-btn outline">View Components</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div className="preview-card">
            <div className="preview-header">
              <div className="window-controls">
                <span />
                <span />
                <span />
              </div>
              <div className="preview-url">launchai.dev/preview</div>
            </div>
            <div className="preview-body">
              <div className="preview-top">
                <div className="preview-icon">⚡</div>
                <div className="preview-text">
                  <div className="preview-line short" />
                  <div className="preview-line long" />
                </div>
              </div>
              <div className="preview-grid">
                <div className="preview-block" />
                <div className="preview-block" />
              </div>
              <div className="preview-code">
                <div className="preview-line" />
                <div className="preview-line mid" />
                <div className="preview-line" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}`;

    const featuresJsx = `import React from 'react';
import { motion } from 'framer-motion';

export default function Features({ data, animationLevel = 'subtle' }) {
  const getAnimationVariants = (delay = 0) => {
    if (animationLevel === 'none') return {};
    if (animationLevel === 'dynamic') return {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay },
    };
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay },
    };
  };

  return (
    <section id="features">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Features
        </motion.h2>
        <div className="grid">
          \${data?.map((feature, i) => (
            <motion.div 
              key={i} 
              className="card"
              {...getAnimationVariants(i * 0.1)}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3>\${feature.title}</h3>
              <p>\${feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

    const projectsJsx = `import React from 'react';

export default function Projects({ data }) {
  return (
    <section id="projects">
      <div className="container">
        <h2>Projects</h2>
        <div className="grid">
          \${data?.map((project, i) => (
            <div key={i} className="card">
              <h3>\${project.title}</h3>
              <p>\${project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

    const aboutJsx = `import React from 'react';

export default function About({ data }) {
  return (
    <section id="about">
      <div className="container">
        <h2>\${data?.title}</h2>
        <p>\${data?.description}</p>
      </div>
    </section>
  );
}`;

    const testimonialsJsx = `import React from 'react';

export default function Testimonials({ data }) {
  return (
    <section id="testimonials">
      <div className="container">
        <h2>Testimonials</h2>
        <div className="grid">
          \${data?.slice(0, 3).map((t, i) => {
            const initials = (t.name || '?')
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            return (
              <div key={i} className="testimonial">
                <div className="testimonial-header">
                  <div className="avatar">\${initials}</div>
                  <div>
                    <h4>\${t.name}</h4>
                    <p>\${t.role}</p>
                  </div>
                </div>
                <p className="quote">"\${t.content}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}`;

    const contactJsx = `import React, { useState } from 'react';

export default function Contact({ data }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will get back to you soon.');
    setEmail('');
  };

  return (
    <section id="contact">
      <div className="container">
        <h2>\${data?.title}</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="email"
            placeholder="\${data?.emailPlaceholder || 'your@email.com'}"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="cta-btn">\${data?.buttonText || 'Send'}</button>
        </form>
      </div>
    </section>
  );
}`;

    const footerJsx = `import React from 'react';

export default function Footer({ data }) {
  return (
    <footer>
      <div className="container">
        <p>\${data?.text || '© 2024 All rights reserved'}</p>
        <ul>
          \${data?.links?.map((link) => (
            <li key={link.href}>
              <a href={link.href}>\${link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}`;

    const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Inject data into window
window.__DATA__ = ${JSON.stringify(
      {
        navbar: data?.navbar,
        hero: data?.hero,
        features: rootSections.features,
        projects: rootSections.projects,
        about: rootSections.about,
        testimonials: rootSections.testimonials,
        contact: rootSections.contact,
        footer: data?.footer,
        theme: {
          ...(data?.theme || {}),
          primaryColor,
          background: data?.theme?.background || data?.background || 'gradient',
        },
        design: data?.design || { animationLevel: 'subtle' },
      },
      null,
      2
    )};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    const themeStyles = getThemeStyleValues(data, primaryColor);
    const indexCss = `
:root {
  --primary: ${primaryColor};
  --text: ${themeStyles.textColor};
  --muted: ${themeStyles.mutedColor};
  --bg: ${themeStyles.background};
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

html, body, #root {
  min-height: 100%;
  background: var(--bg, #020617);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg, #020617);
  color: var(--text);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--surface-border);
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 0;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text);
}

nav ul {
  display: flex;
  list-style: none;
  gap: 28px;
  align-items: center;
}

nav a {
  color: var(--nav-link);
  text-decoration: none;
  font-size: 0.92rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

nav a:hover {
  color: var(--nav-hover);
  transform: translateY(-1px);
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  background: var(--primary);
  color: var(--button-text);
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cta-btn.outline {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.cta-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

main {
  padding-bottom: 80px;
}

.hero {
  position: relative;
  overflow: hidden;
  padding: 120px 32px 80px;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}

.hero-glow {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 320px;
  height: 320px;
  border-radius: 9999px;
  background: var(--primary);
  opacity: 0.16;
  filter: blur(120px);
}

.hero-layout {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-content {
  max-width: 640px;
  padding-right: 32px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  margin-bottom: 24px;
}

.hero-content h1 {
  font-size: clamp(3.75rem, 5vw, 5.5rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  margin: 0;
}

.hero-title-light {
  color: var(--text);
}

.text-gradient-primary {
  background: linear-gradient(90deg, var(--primary), rgba(255,255,255,0.92));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-content p {
  font-size: 1.05rem;
  color: var(--muted);
  margin: 24px 0 36px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-image {
  width: 100%;
  max-height: 580px;
  overflow: hidden;
  border-radius: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--surface-border);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 20px;
}

.preview-card {
  position: relative;
  width: min(100%, 520px);
  border-radius: 28px;
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.24);
  overflow: hidden;
  padding: 24px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.window-controls span {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.preview-url {
  font-size: 0.72rem;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted);
}

.preview-body {
  display: grid;
  gap: 18px;
}

.preview-top {
  display: flex;
  align-items: center;
  gap: 18px;
}

.preview-icon {
  width: 46px;
  height: 46px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  display: grid;
  place-items: center;
  color: var(--primary);
}

.preview-text {
  flex: 1;
  display: grid;
  gap: 10px;
}

.preview-line {
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.preview-line.short {
  width: 120px;
}

.preview-line.long {
  width: 220px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.preview-block {
  height: 88px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-code {
  display: grid;
  gap: 10px;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-code .preview-line.mid {
  width: 65%;
}

@media (max-width: 1024px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    padding-top: 100px;
  }
  .hero-actions {
    justify-content: flex-start;
  }
  .nav-links {
    display: none;
  }
}

section {
  padding: 80px 0;
}

section h2 {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.section-intro p {
  color: var(--muted);
  max-width: 650px;
  margin-top: 16px;
  line-height: 1.9;
}

.grid {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-top: 40px;
}

.card {
  padding: 32px;
  border-radius: 24px;
  background: var(--surface-bg);
  border: 1px solid var(--surface-border);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.16);
  min-height: 260px;
}

.testimonial {
  padding: 32px;
  border-radius: 24px;
  background: var(--surface-bg);
  border: 1px solid var(--surface-border);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.18);
}

.contact-form input {
  background: var(--surface-bg);
  border: 1px solid var(--surface-border);
}

.card h3 {
  font-size: 1.2rem;
  margin-bottom: 14px;
  color: var(--text);
}

.card p {
  color: var(--muted);
  line-height: 1.85;
}

.testimonial {
  padding: 32px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.18);
}

.testimonial-header {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: white;
}

.testimonial h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text);
}

.testimonial p {
  margin: 0;
  color: var(--muted);
  font-style: italic;
  line-height: 1.9;
}

.contact-form {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
}

.contact-form input {
  flex: 1 1 320px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.contact-form button {
  min-width: 180px;
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0 24px;
  margin-top: 40px;
  text-align: center;
  color: var(--muted);
  font-size: 0.95rem;
}

footer ul {
  display: flex;
  justify-content: center;
  gap: 24px;
  list-style: none;
  margin-top: 16px;
  flex-wrap: wrap;
}

footer a {
  color: var(--muted);
  text-decoration: none;
}

footer a:hover {
  color: var(--text);
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  nav ul {
    display: none;
  }

  header {
    padding: 16px 0;
  }

  .hero-content h1 {
    font-size: 2.7rem;
  }

  section {
    padding: 60px 0;
  }

  .contact-form {
    flex-direction: column;
  }
}
`;

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data?.navbar?.logo?.text || "Landing Page"}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

    const viteconfigTs = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})`;

    // Write files
    fs.writeFileSync(path.join(outputDir, "package.json"), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.join(outputDir, "vite.config.ts"), viteconfigTs);
    fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml);
    fs.writeFileSync(path.join(outputDir, "src", "main.jsx"), mainJsx);
    fs.writeFileSync(path.join(outputDir, "src", "App.jsx"), appJsx);
    fs.writeFileSync(path.join(outputDir, "src", "index.css"), indexCss);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Navbar.jsx"), navbarJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Hero.jsx"), heroJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Features.jsx"), featuresJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Projects.jsx"), projectsJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "About.jsx"), aboutJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Testimonials.jsx"), testimonialsJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Contact.jsx"), contactJsx);
    fs.writeFileSync(path.join(outputDir, "src", "components", "Footer.jsx"), footerJsx);
    fs.writeFileSync(path.join(outputDir, ".gitignore"), `node_modules\ndist\n.env.local`);
    fs.writeFileSync(path.join(outputDir, "README.md"), `# Landing Page

Generated with LaunchAI

## Getting started

\`\`\`
npm install
npm run dev
\`\`\`

## Build for production

\`\`\`
npm run build
\`\`\``);

    return outputDir;
  } catch (error) {
    console.error("React generation error:", error);
    throw new Error(`Failed to generate React project: ${error.message}`);
  }
}
