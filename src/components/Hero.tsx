import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditModal } from "@/contexts/AuditModalContext";

const stats = [
  { value: "47+", label: "sites livrés" },
  { value: "94%", label: "clients satisfaits" },
  { value: "7j", label: "délai moyen" },
];

const Hero = () => {
  const { open } = useAuditModal();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/15 blur-[100px] animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[80px] animate-blob" style={{ animationDelay: "4s" }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="section-label mb-6 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            Agence web — Aveyron & Occitanie
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
          Votre site web, votre meilleur{" "}<span className="text-gradient">commercial.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Nous créons des sites web performants qui attirent vos clients, pour les artisans, commerçants et indépendants du Sud de la France.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-primary text-primary-foreground hover:brightness-110 rounded-xl px-8 py-6 text-base animate-pulse-glow" onClick={() => open()}>
            Obtenir mon audit gratuit <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-base" asChild>
            <a href="#services">Découvrir nos offres</a>
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex justify-center gap-8 md:gap-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground">
          <span className="text-xs">Explorer</span>
          <ChevronDown className="size-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
