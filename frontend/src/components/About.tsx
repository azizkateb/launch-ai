import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";

interface AboutProps {
  about?: {
    title: string;
    description: string;
  };
  theme: ThemeData;
  design: DesignSystem;
}

export function About({ about, theme, design }: AboutProps) {
  const styles = getThemeStyles(theme, design);

  return (
    <AnimatedSection
      id="about"
      animationLevel={design.animationLevel}
      className={cn("overflow-hidden", styles.density.sectionPadding)}
      style={{ color: styles.textColor }}
    >
      <div className="mx-auto max-w-6xl">
        <div className={cn(styles.cardClass, "p-10")}> 
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: styles.accentColor }}>
            About
          </p>
          <h2 className="mt-4 text-3xl font-semibold" style={{ color: styles.textColor }}>
            {about?.title || "What makes your solution unique?"}
          </h2>
          <p className="mt-6 leading-8" style={{ color: styles.mutedTextColor }}>
            {about?.description || "This section presents the value proposition and brand story in a clean, high-trust layout."}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
