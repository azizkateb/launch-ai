import { motion } from "framer-motion";

type ThemeData = {
  style: string;
  primaryColor: string;
  background?: string;
};

interface CTASectionProps {
  title: string;
  button: string;
  theme: ThemeData;
}

function getButtonContrast(theme: ThemeData) {
  const normalizedStyle = theme.style.toLowerCase();
  const normalizedBackground = String(theme.background || "").toLowerCase();
  const brightBackgrounds = ["light", "warm", "cool", "grass"];
  const isLight =
    normalizedStyle.includes("light") ||
    normalizedBackground.includes("light") ||
    brightBackgrounds.some((value) => normalizedBackground.includes(value));

  return isLight ? "#111827" : "#ffffff";
}

export function CTASection({ title, button, theme }: CTASectionProps) {
  const normalizedStyle = theme.style.toLowerCase();
  const normalizedBackground = String(theme.background || "").toLowerCase();
  const brightBackgrounds = ["light", "warm", "cool", "grass"];
  const isLight =
    normalizedStyle.includes("light") ||
    normalizedBackground.includes("light") ||
    brightBackgrounds.some((value) => normalizedBackground.includes(value));
  const isElegant = normalizedStyle.includes("elegant");

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className={`rounded-[2rem] border p-8 sm:p-10 ${isElegant ? "border-white/10 bg-white/10 text-white shadow-xl" : isLight ? "border-slate-200 bg-white text-slate-900" : "border-white/10 bg-slate-900 text-white"}`}
    >
      <div className="max-w-4xl space-y-6 text-center">
        <h2 className="text-3xl font-semibold leading-tight">{title}</h2>
        <div>
          <a
            href="#"
            style={{
              backgroundColor: theme.primaryColor,
              color: getButtonContrast(theme),
            }}
            className="inline-flex min-w-[220px] items-center justify-center rounded-full px-10 py-4 text-sm font-semibold shadow-xl shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5"
          >
            {button}
          </a>
        </div>
      </div>
    </motion.section>
  );
}
