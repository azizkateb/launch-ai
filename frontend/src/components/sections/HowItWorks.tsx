import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Describe your product",
    description: "Tell us what you're building, who it's for, and the vibe you want."
  },
  {
    num: "02",
    title: "AI generates the codebase",
    description: "Within seconds, get a fully styled, responsive React frontend tailored to your brand."
  },
  {
    num: "03",
    title: "Export and deploy",
    description: "Download the clean source code or deploy directly to Vercel/Netlify."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative text-center pt-8 md:pt-0"
            >
              <div className="w-20 h-20 mx-auto bg-black border border-white/10 rounded-full flex items-center justify-center text-2xl font-bold font-display text-white relative z-10 mb-6 glow-blue">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
