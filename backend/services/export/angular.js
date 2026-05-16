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

export async function generateAngularProject(data, outputDir) {
  try {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(path.join(outputDir, "src", "app"), { recursive: true });

    const primaryColor = getPrimaryColor(data);
    const themeStyles = getThemeStyleValues(data, primaryColor);
    const backgroundStyle = themeStyles.background;
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
      version: "0.0.0",
      scripts: {
        ng: "ng",
        start: "ng serve",
        build: "ng build",
      },
      private: true,
      dependencies: {
        "@angular/animations": "^17.0.0",
        "@angular/common": "^17.0.0",
        "@angular/compiler": "^17.0.0",
        "@angular/core": "^17.0.0",
        "@angular/forms": "^17.0.0",
        "@angular/platform-browser": "^17.0.0",
        "@angular/platform-browser-dynamic": "^17.0.0",
        rxjs: "~7.8.0",
        tslib: "^2.3.0",
        "zone.js": "~0.14.0",
      },
      devDependencies: {
        "@angular-devkit/build-angular": "^17.0.0",
        "@angular/cli": "^17.0.0",
        "@angular/compiler-cli": "^17.0.0",
        typescript: "~5.2.0",
      },
    };

    // App component TypeScript
    const appTs = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AboutComponent } from './components/about/about.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    ProjectsComponent,
    AboutComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navbarData = ${JSON.stringify(data?.navbar, null, 2)};
  heroData = ${JSON.stringify(data?.hero, null, 2)};
  featuresData = ${JSON.stringify(rootSections.features, null, 2)};
  projectsData = ${JSON.stringify(rootSections.projects, null, 2)};
  aboutData = ${JSON.stringify(rootSections.about, null, 2)};
  testimonialsData = ${JSON.stringify(rootSections.testimonials, null, 2)};
  contactData = ${JSON.stringify(rootSections.contact, null, 2)};
  footerData = ${JSON.stringify(data?.footer, null, 2)};
}`;

    const appHtml = `<app-navbar [data]="navbarData"></app-navbar>
<main>
  <app-hero [data]="heroData"></app-hero>
  ${rootSections.features?.length > 0 ? "<app-features [data]=\"featuresData\"></app-features>" : ""}
  ${rootSections.projects?.length > 0 ? "<app-projects [data]=\"projectsData\"></app-projects>" : ""}
  ${rootSections.about ? "<app-about [data]=\"aboutData\"></app-about>" : ""}
  ${rootSections.testimonials?.length > 0 ? "<app-testimonials [data]=\"testimonialsData\"></app-testimonials>" : ""}
  ${rootSections.contact ? "<app-contact [data]=\"contactData\"></app-contact>" : ""}
</main>
<app-footer [data]="footerData"></app-footer>`;

    const appCss = `
:root {
  --primary: ${primaryColor};
  --text: #ffffff;
  --muted: #cbd5e1;
  --bg: #111827;
}

:host {
  display: block;
}

main {
  flex: 1;
}`;

    // Component files
    const createComponentTs = (selector, name, templateFile) => `
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '${selector}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.css']
})
export class ${name.charAt(0).toUpperCase() + name.slice(1)}Component {
  @Input() data: any;
}`;

    const navbarHtml = `<header>
  <nav>
    <div class="logo">{{ data?.logo?.text || 'Logo' }}</div>
    <ul>
      <li *ngFor="let link of data?.links">
        <a [href]="link.href">{{ link.label }}</a>
      </li>
    </ul>
    <button class="cta-btn">{{ data?.ctaButton?.text || 'Get Started' }}</button>
  </nav>
</header>`;

    const navbarCss = `
header {
  border-bottom: 1px solid var(--surface-border);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--header-bg);
  backdrop-filter: blur(10px);
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
  color: var(--nav-link);
  text-decoration: none;
  transition: color 0.3s;
}

nav a:hover {
  color: var(--nav-hover);
}

.cta-btn {
  background: var(--primary);
  color: var(--button-text);
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}`;

    const heroHtml = `<section id="hero" class="hero">
  <div class="hero-content">
    <h1>{{ data?.title || 'Welcome' }}</h1>
    <p>{{ data?.subtitle || '' }}</p>
    <button class="cta-btn">{{ data?.cta || 'Get Started' }}</button>
  </div>
  <div class="hero-image">
    <img [src]="data?.image?.url || '/placeholder.jpg'" [alt]="data?.image?.alt || 'Hero'" />
  </div>
</section>`;

    const heroCss = `
:host {
  display: block;
}

section {
  padding: 80px 0;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
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

.cta-btn {
  background: var(--primary);
  color: var(--button-text);
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}`;

    const featuresHtml = `<section>
  <div class="container">
    <h2>Features</h2>
    <div class="grid">
      <div class="card" *ngFor="let feature of data">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</section>`;

    const featuresCss = `
section {
  padding: 80px 0;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
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
}`;

    const footerHtml = `<footer>
  <div class="container">
    <p>{{ data?.text || '© 2024 All rights reserved' }}</p>
    <ul *ngIf="data?.links">
      <li *ngFor="let link of data.links">
        <a [href]="link.href">{{ link.label }}</a>
      </li>
    </ul>
  </div>
</footer>`;

    const footerCss = `
footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0;
  margin-top: 80px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

ul {
  display: flex;
  justify-content: center;
  gap: 24px;
  list-style: none;
  margin-top: 16px;
}

a {
  color: var(--muted);
  text-decoration: none;
}

a:hover {
  color: var(--text);
}`;

    const mainTs = `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);`;

    const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Landing Page</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`;

    const stylesGlobalCss = `
:root {
  --primary: ${primaryColor};
  --text: ${themeStyles.textColor};
  --muted: ${themeStyles.mutedColor};
  --bg: ${backgroundStyle};
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

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg, #020617);
  color: var(--text);
  line-height: 1.6;
}

body {
  margin: 0;
  padding: 0;
}

app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}`;

    // Create directory structure
    const dirs = [
      path.join(outputDir, "src", "app", "components", "navbar"),
      path.join(outputDir, "src", "app", "components", "hero"),
      path.join(outputDir, "src", "app", "components", "features"),
      path.join(outputDir, "src", "app", "components", "projects"),
      path.join(outputDir, "src", "app", "components", "about"),
      path.join(outputDir, "src", "app", "components", "testimonials"),
      path.join(outputDir, "src", "app", "components", "contact"),
      path.join(outputDir, "src", "app", "components", "footer"),
    ];

    dirs.forEach((dir) => {
      fs.mkdirSync(dir, { recursive: true });
    });

    // Write main files
    fs.writeFileSync(path.join(outputDir, "package.json"), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.join(outputDir, "src", "main.ts"), mainTs);
    fs.writeFileSync(path.join(outputDir, "src", "index.html"), indexHtml);
    fs.writeFileSync(path.join(outputDir, "src", "styles.css"), stylesGlobalCss);
    fs.writeFileSync(path.join(outputDir, "src", "app", "app.component.ts"), appTs);
    fs.writeFileSync(path.join(outputDir, "src", "app", "app.component.html"), appHtml);
    fs.writeFileSync(path.join(outputDir, "src", "app", "app.component.css"), appCss);

    // Write component files
    const components = [
      { dir: "navbar", html: navbarHtml, css: navbarCss },
      { dir: "hero", html: heroHtml, css: heroCss },
      { dir: "features", html: featuresHtml, css: featuresCss },
      { dir: "projects", html: featuresHtml, css: featuresCss },
      { dir: "about", html: `<section><div class="container"><h2>{{ data?.title }}</h2><p>{{ data?.description }}</p></div></section>`, css: featuresCss },
      { dir: "testimonials", html: featuresHtml, css: featuresCss },
      { dir: "contact", html: `<section><div class="container"><h2>{{ data?.title }}</h2><form><input type="email" [placeholder]="data?.emailPlaceholder" /><button>{{ data?.buttonText }}</button></form></div></section>`, css: featuresCss },
      { dir: "footer", html: footerHtml, css: footerCss },
    ];

    components.forEach((comp) => {
      const name = comp.dir;
      fs.writeFileSync(
        path.join(outputDir, "src", "app", "components", name, `${name}.component.ts`),
        createComponentTs(`app-${name}`, name, `${name}.component.html`)
      );
      fs.writeFileSync(
        path.join(outputDir, "src", "app", "components", name, `${name}.component.html`),
        comp.html
      );
      fs.writeFileSync(
        path.join(outputDir, "src", "app", "components", name, `${name}.component.css`),
        comp.css
      );
    });

    fs.writeFileSync(path.join(outputDir, ".gitignore"), `node_modules\ndist\n.angular`);
    fs.writeFileSync(path.join(outputDir, "README.md"), `# Landing Page (Angular)

Generated with LaunchAI

## Getting started

\`\`\`
npm install
npm start
\`\`\`

## Build for production

\`\`\`
npm run build
\`\`\``);

    return outputDir;
  } catch (error) {
    console.error("Angular generation error:", error);
    throw new Error(`Failed to generate Angular project: ${error.message}`);
  }
}
