import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  footer: {
    text: string;
    links: FooterLink[];
  };
  theme: ThemeData;
  design: DesignSystem;
}

export function Footer({ footer, theme, design }: FooterProps) {
  const styles = getThemeStyles(theme, design);

  return (
    <AnimatedSection
      id="footer"
      animationLevel={design.animationLevel}
      className={cn("border-t", styles.radiusClass)}
      style={{ borderColor: styles.borderStyle.borderColor }}
      as="footer"
    >
      <div className={cn("mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between", styles.fontClass)}>
        <p className="text-sm" style={{ color: styles.mutedTextColor }}>
          {footer.text}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm transition hover:opacity-80"
              style={{ color: styles.textColor }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
