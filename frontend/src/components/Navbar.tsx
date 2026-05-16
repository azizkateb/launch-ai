import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";

type NavbarLink = {
  label: string;
  href: string;
};

type NavbarBrand = {
  text: string;
  icon?: string;
};

type NavbarCTA = {
  text: string;
  style: "primary" | "outline" | string;
};

interface NavbarProps {
  navbar: {
    logo: NavbarBrand;
    links?: NavbarLink[];
    ctaButton: NavbarCTA;
  };
  theme: ThemeData;
  design: DesignSystem;
}

const iconMap: Record<string, string> = {
  code: "</>",
  rocket: "🚀",
  sparkles: "✨",
};

export function Navbar({ navbar, theme, design }: NavbarProps) {
  const styles = getThemeStyles(theme, design);
  const logoIcon = navbar.logo.icon ? iconMap[navbar.logo.icon.toLowerCase()] ?? navbar.logo.text?.slice(0, 1).toUpperCase() : navbar.logo.text?.slice(0, 1).toUpperCase();

  return (
    <AnimatedSection
      as="header"
      animationLevel={design.animationLevel === "none" ? "none" : "subtle"}
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        styles.radiusClass,
        "border-opacity-10"
      )}
      style={{
        background: styles.rootStyle.background,
        borderColor: styles.borderStyle.borderColor,
        color: styles.textColor,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid h-11 w-11 place-items-center text-base font-semibold",
              styles.radiusClass
            )}
            style={{ backgroundColor: styles.accentColor, color: styles.buttonStyle.color }}
          >
            {logoIcon}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em]" style={{ color: styles.mutedTextColor }}>
              {navbar.logo.text}
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navbar.links?.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm transition hover:opacity-80"
              style={{ color: styles.textColor }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div>
          <a
            href={navbar.ctaButton.style === "outline" ? "#contact" : "#hero"}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition",
              styles.radiusClass
            )}
            style={
              navbar.ctaButton.style === "outline"
                ? {
                    borderColor: styles.accentColor,
                    borderWidth: 1,
                    color: styles.accentColor,
                    backgroundColor: "transparent",
                  }
                : styles.buttonStyle
            }
          >
            {navbar.ctaButton.text || "Get Started"}
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
