import { motion } from "framer-motion";
import { LayoutTemplate, Sparkles, Zap, Search, Download, Palette } from "lucide-react";

const features = [
  {
    title: "AI Content Generation",
    description: "Instantly generate persuasive copy, headlines, and calls-to-action tailored to your audience.",
    icon: Sparkles,
  },
  {
    title: "Instant UI Creation",
    description: "Go from prompt to fully styled React components in seconds, not days.",
    icon: Zap,
  },
  {
    title: "Responsive Layouts",
    description: "Every generated page is perfectly optimized for mobile, tablet, and desktop out of the box.",
    icon: LayoutTemplate,
  },
  {
    title: "SEO Optimization",
    description: "Built-in meta tags, semantic HTML, and fast loading speeds to help you rank higher.",
    icon: Search,
  },
  {
    title: "Export to React",
    description: "One click export to clean, maintainable React/Tailwind codebase ready for deployment.",
    icon: Download,
  },
  {
    title: "Custom Themes",
    description: "Easily adapt the generated design to match your brand's unique color palette and typography.",
    icon: Palette,
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Everything you need to <span className="text-gradient">ship</span></h2>
          <p className="text-muted-foreground text-lg">We've automated the tedious parts of frontend development so you can focus on your product.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <feature.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
