import { motion } from "framer-motion";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { cn } from "@/lib/utils";
import { About } from "./About";
import { Contact } from "./Contact";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Navbar } from "./Navbar";
import { Projects } from "./Projects";
import { Testimonials } from "./Testimonials";

export interface LandingPageData {
  layout?: string;
  design: DesignSystem;
  theme: ThemeData;
  navbar: {
    logo: {
      text: string;
      icon?: string;
    };
    links?: Array<{ label: string; href: string }>;
    ctaButton: {
      text: string;
      style: "primary" | "outline" | string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    image?: {
      url?: string;
      alt?: string;
    };
  };
  sections?: {
    about?: {
      title: string;
      description: string;
    };
    features?: Array<{ title: string; description: string }>;
    projects?: Array<{ title: string; description: string }>;
    testimonials?: Array<{ name: string; role: string; content: string }>;
    contact?: {
      title: string;
      emailPlaceholder: string;
      buttonText: string;
    };
  };
  about?: {
    title: string;
    description: string;
  };
  features?: Array<{ title: string; description: string }>;
  projects?: Array<{ title: string; description: string }>;
  testimonials?: Array<{ name: string; role: string; content: string }>;
  contact?: {
    title: string;
    emailPlaceholder: string;
    buttonText: string;
  };
  footer: {
    text: string;
    links: Array<{ label: string; href: string }>;
  };
  color?: string;
  background?: string;
}

interface LandingPageProps {
  data?: LandingPageData | null;
  loading?: boolean;
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="w-full rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
    >
      <div className="space-y-8">
        <div className="animate-pulse rounded-4xl bg-slate-800 p-10" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="animate-pulse rounded-3xl bg-slate-800 p-6 h-40" />
          <div className="animate-pulse rounded-3xl bg-slate-800 p-6 h-40" />
          <div className="animate-pulse rounded-3xl bg-slate-800 p-6 h-40" />
          <div className="animate-pulse rounded-3xl bg-slate-800 p-6 h-40" />
        </div>
        <div className="space-y-5">
          <div className="animate-pulse rounded-3xl bg-slate-800 p-6 h-28" />
          <div className="animate-pulse rounded-3xl bg-slate-800 p-6 h-28" />
        </div>
        <div className="animate-pulse rounded-4xl bg-slate-800 p-10 h-40" />
      </div>
    </motion.div>
  );
}

export function LandingPage({ data, loading = false }: LandingPageProps) {
  const theme = {
    style: data?.theme?.style ?? "dark",
    primaryColor: data?.theme?.primaryColor || data?.color || "#6366f1",
    background: data?.theme?.background || data?.background || "gradient",
  };
  const design = data?.design ?? {
    style: "modern",
    font: "inter",
    radius: "rounded",
    shadow: "light",
    density: "medium",
    animationLevel: "subtle",
  };
  const styles = getThemeStyles(theme, design);
  const sections = {
    about: data?.sections?.about ?? data?.about,
    features: data?.sections?.features ?? data?.features,
    projects: data?.sections?.projects ?? data?.projects,
    testimonials: data?.sections?.testimonials ?? data?.testimonials,
    contact: data?.sections?.contact ?? data?.contact,
  };
  const hero = data?.hero ?? { title: "", subtitle: "", cta: "", image: undefined };

  if (loading || !data) {
    return <LoadingState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={styles.rootStyle}
      className={cn("w-full overflow-hidden", styles.fontClass)}
    >
      <div className="min-h-screen">
        <Navbar navbar={data.navbar} theme={theme} design={design} />
        <main className="space-y-10">
          <Hero {...hero} theme={theme} design={design} />
          <Features features={sections.features} theme={theme} design={design} />
          <Projects projects={sections.projects} theme={theme} design={design} />
          <About about={sections.about} theme={theme} design={design} />
          <Testimonials testimonials={sections.testimonials} theme={theme} design={design} />
          <Contact contact={sections.contact} theme={theme} design={design} />
        </main>
        <div className="px-6 pb-12 pt-10 sm:px-8">
          <Footer footer={data.footer} theme={theme} design={design} />
        </div>
      </div>
    </motion.div>
  );
}
