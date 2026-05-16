import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Loader2, AlertCircle, CheckCircle, Maximize2 } from "lucide-react";
import { LandingPage, type LandingPageData } from "@/components/LandingPage";
import { HeroEditor } from "@/components/HeroEditor";
import ExportDialog from "@/components/ExportDialog";
import { apiFetch } from "@/config/api";

export function Generator() {
  // Form state
  const [businessType, setBusinessType] = useState("saas");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("modern");
  const [color, setColor] = useState("red");
  const [background, setBackground] = useState("gradient");
  const [customBackground, setCustomBackground] = useState("");

  // API state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<LandingPageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!audience.trim()) {
      setError("Please enter a target audience");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return p + Math.random() * 20;
      });
    }, 300);

    try {
      // convert file to base64 if provided
      const fileToBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const heroImageBase64 = heroFile ? await fileToBase64(heroFile) : undefined;

      const data = await apiFetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessType,
          audience,
          style,
          color,
          background: background === "custom" ? customBackground : background,
          heroImageBase64,
        }),
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to generate landing page");
      }

      setProgress(100);
      setGeneratedContent(data.data);
      setSuccess(true);

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate landing page. Please try again.";
      setError(errorMessage);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <section id="generator" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Generate in <span className="text-gradient-primary">seconds</span></h2>
          <p className="text-muted-foreground text-lg">Stop writing boilerplate. Let our AI build the foundation while you focus on the product.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border border-white/10"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-100">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Alert */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-100">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>Landing page generated successfully!</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white">
                    <SelectItem value="saas">SaaS Startup</SelectItem>
                    <SelectItem value="agency">Creative Agency</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="portfolio">Personal Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience</Label>
                <Input 
                  id="target-audience" 
                  placeholder="e.g. Enterprise developers, Small business owners"
                  value={audience}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAudience(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label>Hero image (optional)</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (!f) return;
                      setHeroFile(f);
                      setHeroPreview(URL.createObjectURL(f));
                    }}
                    disabled={isGenerating}
                  />
                </div>
                {heroPreview ? (
                  <div className="mt-2 w-full max-w-md overflow-hidden rounded border">
                    <img src={heroPreview} alt="preview" className="h-48 w-full object-cover" />
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-slate-500">No image selected.</div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <Select value={color} onValueChange={setColor} disabled={isGenerating}>
                    <SelectTrigger id="accent-color" className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Accent color" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="teal">Teal</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Background</Label>
                  <Select value={background} onValueChange={setBackground} disabled={isGenerating}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Background style" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="grass">Grass</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cool">Cool</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      <SelectItem value="modern">Modern tech</SelectItem>
                      <SelectItem value="brutalism">Neo-brutalism</SelectItem>
                      <SelectItem value="elegant">Elegant luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {background === "custom" ? (
                <div className="space-y-2">
                  <Label htmlFor="custom-background">Custom background</Label>
                  <Input
                    id="custom-background"
                    placeholder="e.g. radial-gradient(circle, #f0abfc, #6d28d9)"
                    value={customBackground}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomBackground(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    disabled={isGenerating}
                  />
                </div>
              ) : null}

              {generatedContent && (
                <div className="pt-4">
                  <HeroEditor
                    hero={generatedContent.hero}
                    setHero={(h) => {
                      setGeneratedContent((prev) => {
                        if (!prev) return prev;
                        const next = typeof h === "function" ? h(prev.hero) : h;
                        return { ...prev, hero: { ...(prev.hero || {}), ...(next || {}) } } as LandingPageData;
                      });
                    }}
                  />
                </div>
              )}

              <Button 
                type="submit"
                disabled={isGenerating}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Landing Page
                  </>
                )}
              </Button>

              {generatedContent && (
                <Button 
                  type="button"
                  onClick={() => setShowExportDialog(true)}
                  disabled={isGenerating}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl"
                >
                  📥 Export & Download
                </Button>
              )}
            </form>
          </motion.div>

          {/* Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_32px_90px_rgba(15,23,42,0.35)] h-[760px] lg:h-[900px] max-h-[92vh]"
          >
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-transparent">
              <div className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] shadow-sm" />
              <div className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] shadow-sm" />
              <div className="h-3.5 w-3.5 rounded-full bg-[#27C93F] shadow-sm" />
              <div className="ml-auto flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>Preview</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200 transition hover:bg-white/10"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Maximize
                    </button>
                  </DialogTrigger>
                  <DialogContent className="fixed inset-0 z-50 m-0 h-full w-full max-w-none rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-none left-0 top-0 translate-x-0 translate-y-0">
                    <div className="flex h-full w-full flex-col overflow-hidden bg-transparent text-white">
                      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                        <div>
                          <DialogTitle className="text-sm uppercase tracking-[0.24em] text-slate-400">Live preview</DialogTitle>
                          <DialogDescription className="text-xs text-slate-500">Screen-reader friendly page preview dialog.</DialogDescription>
                        </div>
                        <DialogClose asChild>
                          <button className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100 transition hover:bg-white/10">
                            Close
                          </button>
                        </DialogClose>
                      </div>
                      <div className="flex-1 overflow-auto p-6 md:p-8">
                        <LandingPage data={generatedContent} loading={isGenerating && !generatedContent} />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex-1 relative p-4 bg-transparent overflow-hidden">
              <div className="h-full overflow-y-auto rounded-[1.75rem] border border-white/10 bg-transparent shadow-inner">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <LandingPage data={generatedContent} loading />
                    </motion.div>
                  ) : generatedContent ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-full"
                    >
                      <LandingPage data={generatedContent} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full border-2 border-dashed border-white/10 rounded-[1.75rem] flex flex-col items-center justify-center text-center p-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-white/20" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Ready to generate</h3>
                      <p className="text-muted-foreground text-sm max-w-[250px]">Fill out the form to instantly create a production-ready landing page.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ExportDialog 
        generatedContent={generatedContent}
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </section>
  );
}
