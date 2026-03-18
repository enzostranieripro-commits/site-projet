import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditModal } from "@/contexts/AuditModalContext";
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from "./SectionHeader";

const villes = [
  "Rodez", "Millau", "Villefranche-de-Rouergue", "Onet-le-Château", "Decazeville",
  "Espalion", "Saint-Affrique", "Luc-la-Primaube", "Toulouse", "Montpellier",
  "Albi", "Cahors", "Montauban", "Nîmes", "Perpignan", "Auch", "Tarbes", "Foix",
  "Carcassonne", "Béziers", "Figeac", "Castres", "Mende",
];

const questions = [
  { q: "Quel est votre secteur d'activité ?", type: "select" as const, options: ["Artisan BTP", "Restauration", "Commerce", "Santé", "Immobilier", "Tourisme", "Services", "Autre"] },
  { q: "Avez-vous déjà un site internet ?", type: "single" as const, options: ["Oui, mais il est ancien", "Oui, il est récent", "Non, pas encore", "Je ne sais pas"] },
  { q: "Combien de demandes clients recevez-vous par semaine ?", type: "single" as const, options: ["Plus de 5", "2 à 5", "Moins de 2", "Aucune"] },
  { q: "Êtes-vous présent sur les réseaux sociaux ?", type: "single" as const, options: ["Oui, je publie régulièrement", "Oui, mais rarement", "Non, pas du tout", "Compte inactif"] },
  { q: "Quelles tâches répétitives aimeriez-vous automatiser ?", type: "multi" as const, options: ["Prise de RDV", "Envoi de devis", "Relances clients", "Gestion des réseaux", "Facturation", "Aucune"] },
];

function getRecommendation(answers: string[]): string {
  if (answers[2] === "Plus de 5") return "Conversion";
  if (answers[1] === "Oui, il est récent" || answers[1] === "Oui, mais il est ancien") return "Autorité";
  return "Visibilité";
}

const DiagnosticSection = () => {
  const { open } = useAuditModal();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const rec = getRecommendation(newAnswers);
      setRecommendation(rec);
      setDone(true);
      await supabase.from("diagnostics").insert({
        secteur: newAnswers[0],
        a_un_site: newAnswers[1],
        demandes_semaine: newAnswers[2],
        reseaux_sociaux: newAnswers[3],
        taches_repetitives: answer.split(", "),
        offre_recommandee: rec,
      });
    }
  };

  const handleMultiSubmit = () => {
    handleAnswer(multiSelect.length > 0 ? multiSelect.join(", ") : "Aucune");
  };

  const toggleMulti = (opt: string) => {
    setMultiSelect((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);
  };

  const reset = () => {
    setStarted(false);
    setStep(0);
    setAnswers([]);
    setMultiSelect([]);
    setDone(false);
    setRecommendation("");
  };

  const q = questions[step];

  return (
    <section id="diagnostic" className="section-padding">
      {/* Ville ticker */}
      <div className="overflow-hidden mask-fade-x mb-12">
        <div className="flex animate-marquee-slow whitespace-nowrap">
          {[...villes, ...villes].map((v, i) => (
            <span key={i} className="mx-4 text-xs text-muted-foreground/40">{v}</span>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <SectionHeader label="DIAGNOSTIC GRATUIT" title="Découvrez l'offre idéale pour" highlight="votre activité" />

        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:brightness-110 px-10 py-6 text-base rounded-xl" onClick={() => setStarted(true)}>
                Lancer le diagnostic gratuit <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.div>
          ) : !done ? (
            <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card-surface p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-border rounded-t-xl overflow-hidden">
                <motion.div className="h-full bg-primary" animate={{ width: `${((step + 1) / questions.length) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mb-4">Question {step + 1} / {questions.length}</p>
              <h3 className="text-xl font-semibold mb-6">{q.q}</h3>

              {q.type === "multi" ? (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt) => (
                      <button key={opt} onClick={() => toggleMulti(opt)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${multiSelect.includes(opt) ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleMultiSubmit} className="w-full">Valider <ArrowRight className="ml-2 size-4" /></Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt) => (
                    <motion.button key={opt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(opt)}
                      className="text-left px-4 py-3 rounded-xl border border-border text-sm hover:border-primary hover:bg-primary/5 transition-all">
                      {opt}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-8 text-center glow-primary">
              <CheckCircle className="size-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Notre recommandation : <span className="text-gradient">{recommendation}</span></h3>
              <p className="text-muted-foreground mb-6">
                Basé sur votre profil, l'offre <strong>{recommendation}</strong> est la plus adaptée pour développer votre activité dans le secteur "{answers[0]}".
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground rounded-xl" onClick={() => { reset(); open(); }}>
                  Réserver un audit gratuit <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button variant="outline" onClick={reset} className="rounded-xl">Recommencer</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DiagnosticSection;
