import { motion } from "framer-motion";
import { GeneratedHero } from "./GeneratedHero";

interface LandingPagePreviewProps {
  content: {
    hero?: {
      title: string;
      subtitle: string;
      cta: string;
    };
    [key: string]: any;
  };
}

export function LandingPagePreview({ content }: LandingPagePreviewProps) {
  const { hero } = content;

  return (
    <motion.div 
      className="w-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Render the Hero section if available */}
      {hero && <GeneratedHero {...hero} />}

      {/* If no hero, show a minimal landing page structure */}
      {!hero && (
        <div className="min-h-[500px] flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <p className="text-white/50">Preview data loading...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
