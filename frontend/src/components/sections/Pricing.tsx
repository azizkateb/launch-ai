import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Simple pricing</h2>
          <p className="text-muted-foreground text-lg">Start building for free. Upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border border-white/10 flex flex-col"
          >
            <h3 className="text-xl font-medium text-white mb-2">Hobby</h3>
            <div className="text-4xl font-bold text-white mb-6">$0</div>
            <ul className="space-y-4 mb-8 flex-1">
              {["3 generations per month", "Standard templates", "Community support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-white/40" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Get Started</Button>
          </motion.div>

          {/* Pro */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-8 border border-primary relative flex flex-col glow-blue transform md:-translate-y-4 bg-primary/5"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
            <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited generations", "Premium UI components", "Export React codebase", "Priority support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-primary" /> {item}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Subscribe Now</Button>
          </motion.div>

          {/* Business */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-8 border border-white/10 flex flex-col"
          >
            <h3 className="text-xl font-medium text-white mb-2">Agency</h3>
            <div className="text-4xl font-bold text-white mb-6">$99<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Everything in Pro", "Custom brand themes", "Team collaboration", "White-label exports"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-white/40" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Contact Sales</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
