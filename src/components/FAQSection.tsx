import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeader from "./SectionHeader";

const faqs = [
  { q: "Combien de temps faut-il pour créer mon site ?", a: "En moyenne, votre site est en ligne en 7 jours ouvrés." },
  { q: "Est-ce que je suis propriétaire de mon site ?", a: "Absolument. Le site vous appartient à 100%. Vous pouvez le transférer ou le modifier." },
  { q: "Ai-je besoin de compétences techniques ?", a: "Pas du tout. Nous nous occupons de tout : conception, développement, mise en ligne et maintenance." },
  { q: "Puis-je modifier mon site après la livraison ?", a: "Oui, nous vous fournissons un accès simple. Pour les modifications complexes, notre équipe est là." },
  { q: "L'abonnement est-il sans engagement ?", a: "Oui, l'offre mensuelle est sans engagement. L'offre annuelle vous fait économiser 2 mois." },
  { q: "Intervenez-vous uniquement en Aveyron ?", a: "Non ! Nous travaillons dans toute l'Occitanie et la France entière. Tout se fait en ligne." },
  { q: "Le référencement SEO est-il inclus ?", a: "Oui, toutes nos offres incluent une optimisation SEO de base." },
  { q: "L'audit gratuit, c'est vraiment gratuit ?", a: "Oui, 100% gratuit et sans engagement. 20 minutes pour analyser votre situation." },
];

const FAQSection = () => (
  <section id="faq" className="section-padding">
    <div className="max-w-3xl mx-auto">
      <SectionHeader label="FAQ" title="Questions" highlight="fréquentes" />
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="card-surface px-6 border-none">
            <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
