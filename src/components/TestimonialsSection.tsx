import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "./SectionHeader";

const testimonials = [
  { name: "Marc D.", job: "Plombier", city: "Rodez", quote: "En 3 semaines, je suis passé de 0 contact en ligne à 10 demandes par semaine.", before: "0 contact/sem.", after: "10 contacts/sem." },
  { name: "Claire L.", job: "Photographe", city: "Albi", quote: "Mon nouveau site reflète enfin la qualité de mon travail. Les réservations ont doublé.", before: "4 réservations/mois", after: "9 réservations/mois" },
  { name: "Sophie M.", job: "Restauratrice", city: "Millau", quote: "De invisible sur Google à Top 3 Google Maps en 2 mois.", before: "Invisible", after: "Top 3 Google Maps" },
  { name: "Pierre V.", job: "Kiné", city: "Cahors", quote: "La prise de RDV en ligne m'a fait gagner un temps fou.", before: "2h/jour au tél.", after: "15 min/jour" },
  { name: "Léa B.", job: "Fleuriste", city: "Figeac", quote: "Ma boutique en ligne représente maintenant 30% de mon chiffre d'affaires.", before: "0€ en ligne", after: "30% du CA" },
  { name: "Thomas R.", job: "Agent immo", city: "Montauban", quote: "Le site génère des mandats qualifiés chaque semaine.", before: "2 mandats/mois", after: "7 mandats/mois" },
];

const TestimonialsSection = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeader label="TÉMOIGNAGES" title="Ils nous font" highlight="confiance" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-surface p-6">
            <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="size-4 fill-primary text-primary" />)}</div>
            <p className="text-sm text-muted-foreground mb-4 italic">"{t.quote}"</p>
            <div className="flex items-center justify-between">
              <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.job}, {t.city}</p></div>
              <div className="text-right"><p className="text-xs text-muted-foreground line-through">{t.before}</p><p className="text-sm font-semibold text-primary">{t.after}</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
