import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditModal } from "@/contexts/AuditModalContext";

const badges = [
  { icon: Shield, text: "Sans engagement" },
  { icon: Clock, text: "Réponse 24h" },
  { icon: ThumbsUp, text: "94% satisfaction" },
];

const FinalCTA = () => {
  const { open } = useAuditModal();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center"><div className="w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" /></div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Prêt à attirer plus de <span className="text-gradient">clients ?</span></h2>
          <p className="text-lg text-muted-foreground mb-8">Réservez votre audit gratuit de 20 minutes et découvrez comment doubler vos demandes clients.</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:brightness-110 rounded-xl px-10 py-6 text-base animate-pulse-glow" onClick={() => open()}>
            Réserver mon audit gratuit <ArrowRight className="ml-2 size-4" />
          </Button>
          <div className="flex justify-center gap-6 mt-8">
            {badges.map((b) => <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground"><b.icon className="size-4 text-primary" />{b.text}</div>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
