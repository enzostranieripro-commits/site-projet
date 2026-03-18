import { motion } from "framer-motion";
import { SearchX, MousePointerClick, ShieldAlert, Clock } from "lucide-react";
import SectionHeader from "./SectionHeader";

const problems = [
  { icon: SearchX, title: "Invisible sur Google", desc: "Vos clients ne vous trouvent pas en ligne. Ils vont chez le concurrent." },
  { icon: MousePointerClick, title: "Un site qui ne génère rien", desc: "Votre site existe mais ne convertit aucun visiteur en client." },
  { icon: ShieldAlert, title: "Une image qui ne rassure pas", desc: "Un site daté ou absent donne une mauvaise première impression." },
  { icon: Clock, title: "Du temps perdu en tâches répétitives", desc: "Rappels, devis, relances… Vous passez des heures sur de l'administratif." },
];

const ProblemSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeader label="LE CONSTAT" title="Pourquoi vous perdez des clients" highlight="chaque jour" description="La majorité des artisans et commerçants en Aveyron n'exploitent pas leur potentiel digital." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-surface-hover p-6">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
              <p.icon className="size-6 text-destructive" />
            </div>
            <h3 className="font-bold text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
