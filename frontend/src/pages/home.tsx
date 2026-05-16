import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Generator } from "@/components/sections/Generator";
import { Features } from "@/components/sections/Features";
import { Showcase } from "@/components/sections/Showcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
      <Navbar />
      <main>
        <Hero />
        <Generator />
        <Features />
        <Showcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
