import { motion } from "framer-motion";
import { Globe, LayoutGrid, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

interface ServicesSectionProps {
  onOpenProductForm: (productType: string) => void;
}

const services = [
  {
    icon: Globe,
    name: "Visibilité",
    title: "Landing page qui convertit les visiteurs en prospects",
    desc: "Une page unique, rapide et percutante conçue pour transformer chaque visiteur en demande client qualifiée.",
    features: ["Livraison en 7 jours ouvrés", "Optimisée SEO local & vitesse", "100% orientée conversion"],
    color: "#22c55e",
    colorClass: "text-green-400",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/20",
    product: "Visibilité",
    price: "à partir de 59 €/mois",
  },
  {
    icon: LayoutGrid,
    name: "Autorité",
    title: "Site vitrine qui installe votre crédibilité en ligne",
    desc: "Un site multi-pages professionnel qui génère des contacts qualifiés et renforce votre image de marque locale.",
    features: ["4 à 6 pages sur-mesure", "Catalogue & portfolio inclus", "SEO on-page optimisé"],
    color: "#6366f1",
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10",
    borderClass: "border-indigo-500/20",
    product: "Autorité",
    price: "à partir de 119 €/mois",
  },
  {
    icon: ShoppingBag,
    name: "Conversion",
    title: "Site commercial qui vend et encaisse en ligne",
    desc: "Un e-commerce complet intégrant le paiement Stripe pour vendre vos produits ou services directement depuis votre site.",
    features: ["Paiement Stripe intégré", "Gestion commandes & emails auto", "Tableau de bord inclus"],
    color: "#f59e0b",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/20",
    product: "Conversion",
    price: "à partir de 199 €/mois",
  },
];

const ServicesSection = ({ onOpenProductForm }: ServicesSectionProps) => (
  <section id="services" className="section-padding relative grain">
    <div className="max-w-6xl mx-auto relative z-10">
      <SectionHeader
        label="NOS OFFRES"
        title="Trois niveaux de présence pour"
        highlight="développer votre activité"
        description="Du premier site web jusqu'au commerce en ligne — chaque offre est construite sur-mesure après votre audit gratuit."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={`group card-surface-hover p-6 flex flex-col relative overflow-hidden border ${s.borderClass}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${s.color}08, transparent)` }} />

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5">
                <div className={`size-12 rounded-xl ${s.bgClass} flex items-center justify-center border ${s.borderClass} transition-transform duration-300 group-hover:scale-110`}>
                  <s.icon className={`size-5 ${s.colorClass}`} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Abonnement</p>
                  <p className="text-sm font-bold" style={{ color: s.color }}>{s.price}</p>
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: s.color }}>{s.name}</p>
              <h3 className="text-lg font-display font-bold mb-3 leading-tight">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className={`w-full rounded-xl group/btn transition-all duration-300`}
                style={{ borderColor: `${s.color}40`, color: s.color }}
                onClick={() => onOpenProductForm(s.product)}
              >
                Demander un audit
                <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="group text-primary text-sm hover:underline inline-flex items-center gap-1"
        >
          Configurer votre offre et estimer le budget
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  </section>
);

export default ServicesSection;
