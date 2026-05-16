import { motion } from "framer-motion";
import { type ReactNode } from "react";

export type AnimationLevel = "none" | "subtle" | "dynamic";

const animationVariants: Record<AnimationLevel, { hidden: { opacity: number; y: number; scale: number }; visible: { opacity: number; y: number; scale: number } }> = {
  none: {
    hidden: { opacity: 1, y: 0, scale: 1 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  subtle: {
    hidden: { opacity: 0, y: 24, scale: 1 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  dynamic: {
    hidden: { opacity: 0, y: 32, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

const animationTransition: Record<AnimationLevel, { duration?: number; ease?: string; type?: "spring"; stiffness?: number; damping?: number; mass?: number }> = {
  none: { duration: 0 },
  subtle: { duration: 0.5, ease: "easeOut" },
  dynamic: { type: "spring", stiffness: 110, damping: 18, mass: 0.85 },
};

const viewportOptions = { once: true, amount: 0.3 } as const;

interface AnimatedSectionProps {
  children: ReactNode;
  animationLevel?: AnimationLevel;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export function AnimatedSection({
  children,
  animationLevel = "subtle",
  className,
  id,
  style,
  as = "section",
}: AnimatedSectionProps) {
  const level = animationLevel === "dynamic" ? "dynamic" : animationLevel === "none" ? "none" : "subtle";
  const MotionTag = motion[as] as typeof motion.section;

  if (level === "none") {
    const Tag = as as keyof JSX.IntrinsicElements;
    return (
      <Tag id={id} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={animationVariants[level]}
      transition={animationTransition[level]}
    >
      {children}
    </MotionTag>
  );
}
