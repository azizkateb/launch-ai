import { cn } from "@/lib/utils";
import { getThemeStyles, type DesignSystem, type ThemeData } from "@/lib/designSystem";
import { AnimatedSection } from "./AnimatedSection";

type Project = {
  title: string;
  description: string;
};

interface ProjectsProps {
  projects?: Project[];
  theme: ThemeData;
  design: DesignSystem;
}

export function Projects({ projects = [], theme, design }: ProjectsProps) {
  const styles = getThemeStyles(theme, design);

  return (
    <AnimatedSection
      id="projects"
      animationLevel={design.animationLevel}
      className={cn("overflow-hidden", styles.density.sectionPadding)}
      style={{ color: styles.textColor }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: styles.mutedTextColor }}>
            Projects
          </p>
          <h2 className="text-3xl font-semibold tracking-tight" style={{ color: styles.textColor }}>
            Built examples aligned to your business direction.
          </h2>
          <p className="max-w-2xl leading-8" style={{ color: styles.mutedTextColor }}>
            The AI automatically fills these project cards with relevant product use cases and customer-facing outcomes.
          </p>
        </div>

        <div className={cn("mt-10 grid gap-6 lg:grid-cols-2", styles.density.sectionGap)}>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <article key={index} className={cn(styles.cardClass, "p-8")}> 
                <h3 className="text-xl font-semibold" style={{ color: styles.textColor }}>
                  {project.title}
                </h3>
                <p className="mt-4 leading-7" style={{ color: styles.mutedTextColor }}>
                  {project.description}
                </p>
              </article>
            ))
          ) : (
            <article className={cn(styles.cardClass, "p-8 lg:col-span-2")}> 
              <p className="text-base leading-7" style={{ color: styles.mutedTextColor }}>
                Project examples are generated automatically from your brand direction. Ready for the experience to update once the AI finishes?
              </p>
            </article>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
