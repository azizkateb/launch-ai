import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface GeneratedHeroProps {
  title: string;
  subtitle: string;
  cta: string;
}

export function GeneratedHero({ title, subtitle, cta }: GeneratedHeroProps) {
  return (
    <motion.div 
      className="relative min-h-[400px] flex items-center justify-center px-6 py-12 bg-gradient-to-b from-white/5 to-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <motion.div 
          className="absolute w-full h-full opacity-20 blur-3xl"
          animate={{
            backgroundPosition: ["0 0", "100px 100px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center max-w-2xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-xs font-medium text-white/70">AI-Generated</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg sm:text-xl text-white/60 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button 
            className="group relative h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {cta}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute top-10 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute bottom-10 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
