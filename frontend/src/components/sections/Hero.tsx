import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-6 border-white/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-white/80">LaunchAI 2.0 is live</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.1] tracking-tight mb-8">
            <span className="text-white">Design to </span>
            <span className="text-gradient-primary">launch</span>
            <br />
            <span className="text-white">in seconds.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Describe your startup. Our AI generates a premium, production-ready React codebase instantly. Stop wrestling with templates.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-white text-black hover:bg-white/90 rounded-full font-medium group">
              Start Generating
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-white/10 text-white hover:bg-white/5 rounded-full font-medium">
              View Components
            </Button>
          </div>
        </motion.div>

        {/* Right Content - Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-[80px] rounded-full"></div>
          
          <div className="relative w-full max-w-md glass-panel rounded-2xl border border-white/10 p-4 shadow-2xl overflow-hidden glow-blue">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block bg-white/5 rounded px-2 py-0.5 text-[10px] text-white/50">launchai.dev/preview</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-white/5 rounded"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="h-24 rounded bg-white/5 border border-white/5 p-3 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <div className="h-3 w-16 bg-white/10 rounded mb-2"></div>
                  <div className="h-8 w-8 rounded-full bg-white/5 mt-4"></div>
                </div>
                <div className="h-24 rounded bg-white/5 border border-white/5 p-3 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <div className="h-3 w-16 bg-white/10 rounded mb-2"></div>
                  <div className="h-8 w-8 rounded-full bg-white/5 mt-4"></div>
                </div>
              </div>

              <div className="h-32 rounded bg-gradient-to-br from-white/5 to-transparent border border-white/5 mt-3 p-4">
                 <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-white/40" />
                  <div className="h-3 w-20 bg-white/10 rounded"></div>
                 </div>
                 <div className="space-y-2">
                   <div className="h-2 w-full bg-white/5 rounded"></div>
                   <div className="h-2 w-4/5 bg-white/5 rounded"></div>
                   <div className="h-2 w-full bg-white/5 rounded"></div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
