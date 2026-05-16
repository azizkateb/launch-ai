import { motion } from "framer-motion";

const showcases = [
  {
    title: "Nova SaaS",
    category: "B2B Software",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3"
  },
  {
    title: "FitTrack",
    category: "Health & Fitness",
    image: "https://images.unsplash.com/photo-1526506114642-54cb358636b5?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3"
  },
  {
    title: "Lumina Agency",
    category: "Creative Portfolio",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2364&ixlib=rb-4.0.3"
  }
];

export function Showcase() {
  return (
    <section id="templates" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Built with <span className="text-gradient">LaunchAI</span></h2>
            <p className="text-muted-foreground text-lg">Explore what's possible. These landing pages were generated from a single text prompt.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{item.category}</div>
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
