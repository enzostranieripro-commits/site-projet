import { motion } from "framer-motion";
import { MapPin, TrendingUp, Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";

const solutions = [
  { icon: MapPin, title: "Référencement local optimisé", result: '"plombier Rodez" → position 1 Google Maps', desc: "Apparaissez en premier quand vos clients cherchent vos services à proximité." },
  { icon: TrendingUp, title: "Un site qui convertit", result: "Taux de conversion ×3", desc: "Design optimisé pour transformer chaque visiteur en demande de devis." },
  { icon: Zap, title: "Des processus simplifiés", result: "5h/semaine économisées", desc: "Automatisez les rappels, la prise de RDV et les relances clients." },
];

const SolutionsSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeader label="NOS SOLUTIONS" title="Ce que nous changeons pour" highlight="votre business" />
      <div className="grid md:grid-cols-3 gap-6">
        {solutions.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-surface-hover p-6 border border-visibility/20">
            <div className="w-12 h-12 rounded-xl bg-visibility/10 flex items-center justify-center mb-4">
              <s.icon className="size-6 text-visibility" />
            </div>
            <h3 className="font-bold text-lg mb-1">{s.title}</h3>
            <p className="text-sm font-semibold text-visibility mb-3">{s.result}</p>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionsSection;
