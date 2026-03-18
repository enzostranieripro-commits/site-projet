import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Star, Globe, LayoutGrid, ShoppingBag, Zap, ChevronLeft, Plus, Calendar, BarChart3, MessageSquare, Search, ThumbsUp, RefreshCw, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

interface PricingSectionProps {
  onOpenAuditForm: () => void;
}

const OFFERS = [
  {
    id: "visibilite",
    name: "Visibilité",
    icon: Globe,
    tagline: "Landing page de conversion",
    color: "#22c55e",
    colorClass: "text-green-400",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/30",
    ringClass: "ring-green-500/40",
    gradientFrom: "from-green-500/5",
    description: "Une page unique, pensée pour capter l'attention et transformer chaque visiteur en prospect qualifié.",
    monthly: 59,
    annual: 590,
    oneshot: 1200,
    badge: null as string | null,
    included: [
      "1 page scrollable sur-mesure",
      "CTA + formulaire de capture de leads",
      "Pop-up de bienvenue / exit intent",
      "Design personnalisé à votre image",
      "Domaine custom + hébergement inclus",
      "Optimisation mobile & vitesse",
      "Mentions légales & RGPD",
    ],
    options: [
      { id: "calendar", icon: Calendar, label: "Intégration Google Calendar", desc: "Prise de RDV en ligne directement depuis la page", price: 350, monthly: 19 },
      { id: "whatsapp", icon: MessageSquare, label: "Widget WhatsApp flottant", desc: "Contact rapide en un clic depuis mobile", price: 150, monthly: 9 },
      { id: "analytics", icon: BarChart3, label: "Tracking Google Analytics", desc: "Suivi visiteurs, clics, conversions", price: 200, monthly: 0 },
      { id: "blog", icon: Search, label: "Section blog / actualités", desc: "Contenu SEO pour attirer des visites organiques", price: 300, monthly: 19 },
    ],
  },
  {
    id: "autorite",
    name: "Autorité",
    icon: LayoutGrid,
    tagline: "Site vitrine multi-pages",
    color: "#6366f1",
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10",
    borderClass: "border-indigo-500/30",
    ringClass: "ring-indigo-500/40",
    gradientFrom: "from-indigo-500/5",
    description: "Un site professionnel complet qui installe votre crédibilité et génère des contacts qualifiés en continu.",
    monthly: 119,
    annual: 1190,
    oneshot: 2300,
    badge: "Le plus choisi" as string | null,
    included: [
      "4 à 6 pages sur-mesure",
      "Formulaire de contact + capture leads",
      "Catalogue produits / services modifiable",
      "Galerie réalisations / portfolio dynamique",
      "SEO on-page de base (balises, sitemap)",
      "Design + animations professionnels",
      "Intégration Google Maps & réseaux sociaux",
      "2 allers-retours de révisions inclus",
    ],
    options: [
      { id: "leads", icon: BarChart3, label: "Tableau de suivi des leads", desc: "CRM léger : chaque contact alimente un tableau de bord", price: 400, monthly: 29 },
      { id: "calendar", icon: Calendar, label: "Google Calendar intégré", desc: "Agenda visible sur le site, réservation de créneaux", price: 350, monthly: 19 },
      { id: "reviews", icon: ThumbsUp, label: "Avis clients automatisés", desc: "Connexion Google Reviews ou Trustpilot en temps réel", price: 250, monthly: 15 },
      { id: "blog", icon: Search, label: "Blog + outil de rédaction", desc: "Contenu optimisé SEO pour attirer du trafic organique", price: 300, monthly: 19 },
    ],
  },
  {
    id: "conversion",
    name: "Conversion",
    icon: ShoppingBag,
    tagline: "Site commercial avec paiement en ligne",
    color: "#f59e0b",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    ringClass: "ring-amber-500/40",
    gradientFrom: "from-amber-500/5",
    description: "Un site e-commerce complet pour vendre vos produits ou services en ligne et encaisser directement.",
    monthly: 199,
    annual: 1990,
    oneshot: 3000,
    badge: null as string | null,
    included: [
      "Tout l'offre Autorité inclus",
      "Intégration paiement en ligne (Stripe)",
      "Catalogue produits / services achetables",
      "Panier + confirmation de commande",
      "Emails automatiques (confirmation, facture)",
      "Tableau de bord commandes basique",
      "3 allers-retours de révisions inclus",
    ],
    options: [
      { id: "promos", icon: Star, label: "Codes promo / réductions", desc: "Le client crée ses propres codes depuis son back-office", price: 300, monthly: 19 },
      { id: "subscriptions", icon: RefreshCw, label: "Abonnements récurrents Stripe", desc: "Vendre des formules mensuelles ou accès membres", price: 500, monthly: 29 },
      { id: "dashboard", icon: BarChart3, label: "Dashboard Analytics avancé", desc: "CA par période, produits vedettes, taux de conversion", price: 600, monthly: 49 },
      { id: "notifications", icon: MessageSquare, label: "Notifications automatiques client", desc: "SMS/email à chaque étape de la commande", price: 350, monthly: 25 },
    ],
  },
];

type Step = "choose" | "pack" | "options" | "format";

export default function PricingSection({ onOpenAuditForm }: PricingSectionProps) {
  const [step, setStep] = useState<Step>("choose");
  const [selectedOffer, setSelectedOffer] = useState<typeof OFFERS[0] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [format, setFormat] = useState<"monthly" | "annual" | "oneshot">("monthly");

  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const getBasePrice = () => {
    if (!selectedOffer) return 0;
    if (format === "monthly") return selectedOffer.monthly;
    if (format === "annual") return selectedOffer.annual;
    return selectedOffer.oneshot;
  };

  const getOptionsTotal = () => {
    if (!selectedOffer) return 0;
    return selectedOffer.options
      .filter(o => selectedOptions.includes(o.id))
      .reduce((sum, o) => {
        if (format === "monthly") return sum + o.monthly;
        if (format === "annual") return sum + o.monthly * 10;
        return sum + o.price;
      }, 0);
  };

  const getTotalLabel = () => {
    const total = getBasePrice() + getOptionsTotal();
    if (format === "monthly") return `à partir de ${total} €/mois`;
    if (format === "annual") return `à partir de ${total} €/an`;
    return `à partir de ${total} €`;
  };

  const steps: { key: Step; label: string }[] = [
    { key: "choose", label: "Offre" },
    { key: "pack", label: "Contenu" },
    { key: "options", label: "Options" },
    { key: "format", label: "Format & Prix" },
  ];

  const goBack = () => {
    const order: Step[] = ["choose", "pack", "options", "format"];
    const idx = order.indexOf(step);
    if (idx > 0) {
      setStep(order[idx - 1]);
      if (order[idx - 1] === "choose") {
        setSelectedOffer(null);
        setSelectedOptions([]);
      }
    }
  };

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <section id="pricing" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="NOS OFFRES"
          title="Choisissez votre"
          highlight="formule sur-mesure"
          description="Explorez nos offres et estimez votre investissement. Chaque projet démarre par un audit gratuit."
        />

        {/* Stepper */}
        <div className="flex items-center justify-center gap-1 mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                step === s.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : currentStepIndex > i
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/50 text-muted-foreground"
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.key ? "bg-white/20" :
                  currentStepIndex > i ? "bg-primary/40" : "bg-border"
                }`}>{i + 1}</span>
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-5 h-px transition-all duration-500 ${currentStepIndex > i ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1 : CHOOSE ── */}
          {step === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-3 gap-5"
            >
              {OFFERS.map((offer, i) => {
                const Icon = offer.icon;
                return (
                  <motion.button
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedOffer(offer); setSelectedOptions([]); setStep("pack"); }}
                    className={`relative text-left rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl group ${
                      offer.badge ? `ring-2 ${offer.ringClass} border-transparent` : "border-border hover:border-primary/30"
                    }`}
                  >
                    {offer.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1 shadow-lg">
                          <Star className="size-2.5 fill-current" /> {offer.badge}
                        </span>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl ${offer.bgClass} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`size-6 ${offer.colorClass}`} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: offer.color }}>{offer.tagline}</p>
                    <h3 className="text-2xl font-display font-black mb-3">{offer.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{offer.description}</p>
                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Abonnement mensuel</p>
                      <p className="text-xl font-bold">{offer.monthly} €<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium" style={{ color: offer.color }}>
                      Configurer mon offre <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                );
              })}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="col-span-full text-center text-sm text-muted-foreground"
              >
                Tous les prix sont indicatifs · Devis personnalisé après audit gratuit · Sans engagement
              </motion.p>
            </motion.div>
          )}

          {/* ── STEP 2 : PACK ── */}
          {step === "pack" && selectedOffer && (
            <motion.div key="pack" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-3 mb-8">
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="size-4" /> Retour
                </button>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOffer.bgClass} ${selectedOffer.colorClass}`}>
                  Offre {selectedOffer.name}
                </div>
              </div>

              <div className={`rounded-2xl border ${selectedOffer.borderClass} bg-gradient-to-br ${selectedOffer.gradientFrom} to-transparent p-8 mb-6`}>
                <div className="flex items-start gap-5 mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${selectedOffer.bgClass} flex items-center justify-center flex-shrink-0`}>
                    <selectedOffer.icon className={`size-7 ${selectedOffer.colorClass}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: selectedOffer.color }}>{selectedOffer.tagline}</p>
                    <h3 className="text-3xl font-display font-black">{selectedOffer.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{selectedOffer.description}</p>
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Ce qui est inclus dans le pack</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedOffer.included.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full ${selectedOffer.bgClass} flex items-center justify-center flex-shrink-0`}>
                        <Check className={`size-3 ${selectedOffer.colorClass}`} />
                      </div>
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="outline" onClick={goBack} className="rounded-xl">Changer d'offre</Button>
                <Button onClick={() => setStep("options")} className="rounded-xl gap-2" style={{ backgroundColor: selectedOffer.color, color: "#fff" }}>
                  Personnaliser avec des options <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 : OPTIONS ── */}
          {step === "options" && selectedOffer && (
            <motion.div key="options" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="size-4" /> Retour
                </button>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOffer.bgClass} ${selectedOffer.colorClass}`}>
                  Options — {selectedOffer.name}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">Sélectionnez les options qui correspondent à vos besoins. Les prix s'afficheront à l'étape suivante selon le format choisi.</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {selectedOffer.options.map((opt, i) => {
                  const selected = selectedOptions.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleOption(opt.id)}
                      className={`relative text-left rounded-2xl border p-5 transition-all duration-300 ${
                        selected
                          ? `${selectedOffer.borderClass} ring-2 ${selectedOffer.ringClass} bg-gradient-to-br ${selectedOffer.gradientFrom} to-transparent`
                          : "border-border bg-secondary/30 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? selectedOffer.bgClass : "bg-muted"}`}>
                            <opt.icon className={`size-4 ${selected ? selectedOffer.colorClass : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{opt.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          selected ? "border-transparent bg-primary" : "border-border"
                        }`}>
                          {selected && <Check className="size-3 text-white" />}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tarification</span>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-muted px-2 py-0.5 rounded font-medium">{opt.monthly > 0 ? `+${opt.monthly}€/mois` : "Inclus"}</span>
                          <span className="bg-muted px-2 py-0.5 rounded font-medium">+{opt.price}€ achat</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedOptions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl ${selectedOffer.bgClass} border ${selectedOffer.borderClass} p-4 mb-6 flex items-center justify-between`}>
                  <span className="text-sm font-medium">{selectedOptions.length} option{selectedOptions.length > 1 ? "s" : ""} sélectionnée{selectedOptions.length > 1 ? "s" : ""}</span>
                  <span className={`text-xs font-bold ${selectedOffer.colorClass}`}>Prix détaillé à l'étape suivante →</span>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="outline" onClick={goBack} className="rounded-xl">Retour</Button>
                <Button onClick={() => setStep("format")} className="rounded-xl gap-2" style={{ backgroundColor: selectedOffer.color, color: "#fff" }}>
                  Voir les prix <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4 : FORMAT & PRICE ── */}
          {step === "format" && selectedOffer && (
            <motion.div key="format" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-3 mb-8">
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="size-4" /> Retour
                </button>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOffer.bgClass} ${selectedOffer.colorClass}`}>
                  Format & Prix — {selectedOffer.name}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { key: "monthly" as const, label: "Abonnement mensuel", icon: RefreshCw, sub: "Flexibilité totale", badge: null },
                  { key: "annual" as const, label: "Abonnement annuel", icon: Calendar, sub: "2 mois offerts vs mensuel", badge: "Économique" },
                  { key: "oneshot" as const, label: "Achat unique", icon: Wallet, sub: "Vous êtes propriétaire", badge: null },
                ].map((f) => (
                  <motion.button
                    key={f.key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormat(f.key)}
                    className={`relative text-left rounded-2xl border p-5 transition-all duration-300 ${
                      format === f.key
                        ? `${selectedOffer.borderClass} ring-2 ${selectedOffer.ringClass} bg-gradient-to-br ${selectedOffer.gradientFrom} to-transparent`
                        : "border-border bg-secondary/30 hover:border-primary/20"
                    }`}
                  >
                    {f.badge && (
                      <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">{f.badge}</span>
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${format === f.key ? selectedOffer.bgClass : "bg-muted"}`}>
                      <f.icon className={`size-4 ${format === f.key ? selectedOffer.colorClass : "text-muted-foreground"}`} />
                    </div>
                    <p className="text-sm font-bold">{f.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.sub}</p>
                  </motion.button>
                ))}
              </div>

              {/* Price card */}
              <motion.div
                key={format}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border ${selectedOffer.borderClass} bg-gradient-to-br ${selectedOffer.gradientFrom} to-transparent p-6 mb-6`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Récapitulatif de votre configuration</p>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <selectedOffer.icon className={`size-4 ${selectedOffer.colorClass}`} />
                      <span className="text-sm font-medium">Pack {selectedOffer.name}</span>
                    </div>
                    <span className="text-sm font-bold">
                      {format === "monthly" && `${selectedOffer.monthly} €/mois`}
                      {format === "annual" && `${selectedOffer.annual} €/an`}
                      {format === "oneshot" && `${selectedOffer.oneshot} €`}
                    </span>
                  </div>

                  {selectedOffer.options.filter(o => selectedOptions.includes(o.id)).length > 0 ? (
                    selectedOffer.options.filter(o => selectedOptions.includes(o.id)).map(opt => (
                      <div key={opt.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <Plus className={`size-3 ${selectedOffer.colorClass}`} />
                          <span className="text-sm text-muted-foreground">{opt.label}</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: selectedOffer.color }}>
                          {format === "monthly" && (opt.monthly > 0 ? `+${opt.monthly} €/mois` : "Inclus")}
                          {format === "annual" && (opt.monthly > 0 ? `+${opt.monthly * 10} €/an` : "Inclus")}
                          {format === "oneshot" && `+${opt.price} €`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-1">Aucune option sélectionnée — pack de base uniquement</p>
                  )}
                </div>

                <div className={`border-t-2 ${selectedOffer.borderClass} pt-5 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Estimation totale</p>
                    <p className="text-xs text-muted-foreground">Devis précis lors de l'audit gratuit</p>
                  </div>
                  <motion.div key={getTotalLabel()} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-right">
                    <p className="text-3xl font-display font-black" style={{ color: selectedOffer.color }}>
                      {format === "monthly" && `${getBasePrice() + getOptionsTotal()} €`}
                      {format === "annual" && `${getBasePrice() + getOptionsTotal()} €`}
                      {format === "oneshot" && `${getBasePrice() + getOptionsTotal()} €`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format === "monthly" && "/mois"}
                      {format === "annual" && "/an"}
                      {format === "oneshot" && "achat unique"}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button
                  onClick={() => { setStep("choose"); setSelectedOffer(null); setSelectedOptions([]); setFormat("monthly"); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Recommencer depuis le début
                </button>
                <Button size="lg" onClick={onOpenAuditForm} className="rounded-xl gap-2 px-8 shadow-lg animate-pulse-glow" style={{ backgroundColor: selectedOffer.color, color: "#fff" }}>
                  Obtenir mon audit gratuit <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
