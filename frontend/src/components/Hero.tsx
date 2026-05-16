import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";
import { getHeroImage } from "@/lib/imageUtils";

type HeroImage = {
  type?: string;
  url?: string;
  alt?: string;
};

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  image?: HeroImage;
  theme: ThemeData;
  design: DesignSystem;
}

export function Hero({ title, subtitle, cta, image, theme, design }: HeroProps) {
  const styles = getThemeStyles(theme, design);
  const [src, setSrc] = useState<string>(getHeroImage({ image }));
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setSrc(getHeroImage({ image }));
    setImageLoaded(false);
  }, [image?.url]);

  const handleImageError = () => setSrc("/placeholder.jpg");
  const altText = image?.alt || "Hero image";

  return (
    <AnimatedSection
      id="hero"
      animationLevel={design.animationLevel}
      className={cn("overflow-hidden", styles.density.sectionPadding)}
      style={{ color: styles.textColor }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.28em]" style={{ color: styles.accentColor }}>
                Custom Image (Upload)
              </p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: styles.textColor }}>
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8" style={{ color: styles.mutedTextColor }}>
                {subtitle}
              </p>
            </div>

            <a
              href="#contact"
              className={cn("inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold transition hover:opacity-90", styles.radiusClass)}
              style={styles.buttonStyle}
            >
              {cta}
            </a>
          </div>

          <div className={cn("overflow-hidden", styles.radiusClass, styles.shadowClass)} style={{ border: `1px solid ${styles.borderStyle.borderColor}` }}>
            <div className="relative aspect-4/3 w-full bg-slate-900/10">
              <img
                src={src}
                alt={altText}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
