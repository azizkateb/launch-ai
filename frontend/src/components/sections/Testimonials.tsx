import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "LaunchAI saved us 2 weeks of frontend work. The generated code was cleaner than what we usually write ourselves.",
    author: "Sarah Chen",
    role: "Founder, Nova SaaS",
    avatar: "SC"
  },
  {
    quote: "The design quality is unreal. It doesn't look like a template, it looks like an agency built it for $10k.",
    author: "Michael Roberts",
    role: "Indie Hacker",
    avatar: "MR"
  },
  {
    quote: "I described my devtools product and it nailed the dark mode developer aesthetic perfectly on the first try.",
    author: "Elena Rodriguez",
    role: "CTO, DevScale",
    avatar: "ER"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(124,58,237,0.1)_0%,transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Loved by founders</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel p-8 rounded-2xl border border-white/5 relative"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-6" />
              <p className="text-lg text-white/90 mb-8 leading-relaxed">"{t.quote}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{t.author}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
