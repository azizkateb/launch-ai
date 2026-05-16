import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";

type Feature = {
  title: string;
  description: string;
};

interface FeaturesProps {
  features?: Feature[];
  theme: ThemeData;
  design: DesignSystem;
}

export function Features({ features = [], theme, design }: FeaturesProps) {
  const styles = getThemeStyles(theme, design);

  return (
    <AnimatedSection
      id="features"
      animationLevel={design.animationLevel}
      className={cn("overflow-hidden", styles.density.sectionPadding)}
      style={{ color: styles.textColor }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: styles.accentColor }}>
            Features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight" style={{ color: styles.textColor }}>
            What your website delivers.
          </h2>
          <p className="max-w-2xl leading-8" style={{ color: styles.mutedTextColor }}>
            These feature cards are populated from the same AI output so your page feels polished and consistent.
          </p>
        </div>

        <div className={cn("mt-10 grid gap-6 md:grid-cols-2", styles.density.sectionGap)}>
          {features.length > 0 ? (
            features.map((feature, index) => (
              <article key={index} className={cn(styles.cardClass, "p-8")}>
                <div className="mb-5 h-1 w-16 rounded-full" style={{ backgroundColor: styles.accentColor }} />
                <h3 className="text-xl font-semibold" style={{ color: styles.textColor }}>
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7" style={{ color: styles.mutedTextColor }}>
                  {feature.description}
                </p>
              </article>
            ))
          ) : (
            <article className={cn(styles.cardClass, "p-8 md:col-span-2")}>
              <p className="text-base leading-7" style={{ color: styles.mutedTextColor }}>
                Feature bullets will appear here once the AI generates page content for your business.
              </p>
            </article>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
