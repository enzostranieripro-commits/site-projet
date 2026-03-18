import { motion } from "framer-motion";
import { Search, Palette, Zap, BarChart3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

const steps = [
  { icon: Search, title: "Audit gratuit", desc: "On analyse votre situation et vos objectifs." },
  { icon: Palette, title: "Conception", desc: "Maquette sur-mesure validée avec vous." },
  { icon: Zap, title: "Livraison rapide", desc: "Votre site en ligne en 7 jours." },
  { icon: BarChart3, title: "Suivi continu", desc: "Optimisation et accompagnement mensuel." },
];

const MethodSection = () => (
  <section id="methode" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeader label="NOTRE MÉTHODE" title="Un process simple en" highlight="4 étapes" />
      <div className="relative grid md:grid-cols-4 gap-8">
        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border" />
        {steps.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <s.icon className="size-8 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground mb-1 block">Étape {i + 1}</span>
            <h3 className="font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MethodSection;
