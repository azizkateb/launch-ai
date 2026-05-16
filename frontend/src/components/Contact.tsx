import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";

interface ContactProps {
  contact?: {
    title: string;
    emailPlaceholder: string;
    buttonText: string;
  };
  theme: ThemeData;
  design: DesignSystem;
}

export function Contact({ contact, theme, design }: ContactProps) {
  const styles = getThemeStyles(theme, design);

  return (
    <AnimatedSection
      id="contact"
      animationLevel={design.animationLevel}
      className={cn("overflow-hidden", styles.density.sectionPadding)}
      style={{ color: styles.textColor }}
    >
      <div className="mx-auto max-w-3xl">
        <div className={cn(styles.cardClass, "p-10")}> 
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: styles.accentColor }}>
            Contact
          </p>
          <h2 className="mt-4 text-3xl font-semibold" style={{ color: styles.textColor }}>
            {contact?.title || "Stay in touch with interested users."}
          </h2>
          <p className="mt-4 leading-7" style={{ color: styles.mutedTextColor }}>
            {contact?.emailPlaceholder ? "Invite visitors to join your launch list or ask questions directly." : "Submit your email for immediate follow-up."}
          </p>

          <form className="mt-8 grid gap-4">
            <input
              type="email"
              placeholder={contact?.emailPlaceholder || "Enter your email"}
              className={cn(
                "w-full rounded-2xl border bg-transparent px-5 py-4 text-base outline-none transition",
                styles.radiusClass
              )}
              style={{
                color: styles.textColor,
                borderColor: styles.borderStyle.borderColor,
              }}
            />
            <button
              type="button"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition",
                styles.radiusClass
              )}
              style={styles.buttonStyle}
            >
              {contact?.buttonText || "Send message"}
            </button>
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
}
