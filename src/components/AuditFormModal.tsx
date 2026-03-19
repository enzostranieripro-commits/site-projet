import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, User, Mail, Phone, Briefcase, Zap, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditFormModalProps {
  open: boolean;
  onClose: () => void;
  productType?: string | null;
}

const productIcons: Record<string, string> = {
  "Visibilité": "🌐",
  "Autorité": "📐",
  "Conversion": "🛒",
  "Site internet": "🌐",
  "Contenu marketing": "📸",
  "Automatisation": "⚡",
};

// Generate available slots Lun-Ven 10h-17h, tranches 1h — next 10 working days
function getSlots() {
  const slots: { date: Date; slots: string[] }[] = [];
  const hours = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  let count = 0;
  while (slots.length < 10) {
    d = new Date(d.getTime() + 86400000);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // skip weekend
    slots.push({ date: new Date(d), slots: hours });
    count++;
  }
  return slots;
}

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_NAMES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function formatDate(d: Date) {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export default function AuditFormModal({ open, onClose, productType }: AuditFormModalProps) {
  const [step, setStep] = useState<"form" | "calendar" | "done">("form");
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", secteur: "" });
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const availableSlots = getSlots();
  const weekSlots = availableSlots.slice(weekOffset * 5, weekOffset * 5 + 5);
  const maxWeek = Math.floor((availableSlots.length - 1) / 5);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("calendar");
  };

  const handleConfirm = () => {
    const slot = availableSlots[selectedDateIdx];
    const finalData = {
      ...form,
      besoin: productType || "Audit général",
      date: slot?.date.toLocaleDateString("fr-FR"),
      time: selectedSlot,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (admin panel)
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(finalData);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    const auditRequests = JSON.parse(localStorage.getItem("audit_requests") || "[]");
    auditRequests.push({ ...form, besoin: productType || "Audit général", createdAt: new Date().toISOString() });
    localStorage.setItem("audit_requests", JSON.stringify(auditRequests));

    if (productType) {
      const productRequests = JSON.parse(localStorage.getItem("product_requests") || "[]");
      productRequests.push({ ...form, product: productType, createdAt: new Date().toISOString() });
      localStorage.setItem("product_requests", JSON.stringify(productRequests));
    }

 fetch("https://hooks.zapier.com/hooks/catch/26893257/upsefk1/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nom: form.nom,
    prenom: form.prenom,
    email: form.email,
    telephone: form.telephone,
    secteur: form.secteur,
    besoin: productType || "Audit général",
    date_rdv: availableSlots[selectedDateIdx]?.date
      .toLocaleDateString("fr-FR"),
    heure_rdv: selectedSlot,
    source: "Studio Nova"
  })
}).catch(err => console.error("Webhook:", err)); 
    setStep("done");
  };

  const handleClose = () => {
    setStep("form");
    setForm({ nom: "", prenom: "", email: "", telephone: "", secteur: "" });
    setSelectedDateIdx(0);
    setSelectedSlot(null);
    setWeekOffset(0);
    onClose();
  };

  if (!open) return null;

  const inputClass = "w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
          className="card-surface w-full max-w-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-0">
            <div>
              {productType ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{productIcons[productType] || "📋"}</span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Offre {productType}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Audit gratuit
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold">
                {step === "form" && "Vos coordonnées"}
                {step === "calendar" && "Choisissez votre créneau"}
                {step === "done" && "Rendez-vous confirmé !"}
              </h2>
              {step === "form" && <p className="text-xs text-muted-foreground mt-1">Étape 1 / 2 — Informations de contact</p>}
              {step === "calendar" && <p className="text-xs text-muted-foreground mt-1">Étape 2 / 2 — Sélectionnez un créneau de rappel</p>}
            </div>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-1 rounded-lg p-1 hover:bg-muted">
              <X className="size-5" />
            </button>
          </div>

          {/* Step indicators */}
          {step !== "done" && (
            <div className="flex gap-2 px-6 mt-4">
              {[0, 1].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  (step === "form" ? 0 : 1) >= i ? "bg-primary" : "bg-border"
                }`} />
              ))}
            </div>
          )}

          <div className="p-6">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: FORM ── */}
              {step === "form" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input required placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className={inputClass} />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input required placeholder="Prénom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input required placeholder="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} className={inputClass} />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <select required value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })} className={`${inputClass} appearance-none`}>
                      <option value="">Secteur d'activité</option>
                      <option>Artisan / BTP</option>
                      <option>Commerce</option>
                      <option>Immobilier</option>
                      <option>Services</option>
                      <option>Tourisme</option>
                      <option>Agriculture</option>
                      <option>Restaurant</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full rounded-xl py-5 gap-2 mt-2">
                    Choisir mon créneau de rappel <ArrowRight className="size-4" />
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">📞 Rappel gratuit · Sans engagement · Sous 24h</p>
                </motion.form>
              )}

              {/* ── STEP 2: CALENDAR ── */}
              {step === "calendar" && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Week navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => { setWeekOffset(w => Math.max(0, w - 1)); setSelectedDateIdx(Math.max(0, weekOffset * 5 - 5)); setSelectedSlot(null); }}
                      disabled={weekOffset === 0}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="text-xs font-medium text-muted-foreground">
                      {weekSlots[0] && formatDate(weekSlots[0].date)} — {weekSlots[weekSlots.length - 1] && formatDate(weekSlots[weekSlots.length - 1].date)}
                    </span>
                    <button
                      onClick={() => { setWeekOffset(w => Math.min(maxWeek, w + 1)); setSelectedDateIdx((weekOffset + 1) * 5); setSelectedSlot(null); }}
                      disabled={weekOffset >= maxWeek}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>

                  {/* Day pills */}
                  <div className="flex gap-2 mb-5">
                    {weekSlots.map((daySlot, i) => {
                      const absIdx = weekOffset * 5 + i;
                      const isSelected = absIdx === selectedDateIdx;
                      return (
                        <button
                          key={i}
                          onClick={() => { setSelectedDateIdx(absIdx); setSelectedSlot(null); }}
                          className={`flex-1 rounded-xl py-2.5 text-center transition-all duration-200 ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-secondary/50 hover:bg-secondary border border-border"
                          }`}
                        >
                          <p className="text-[10px] uppercase tracking-wider font-medium">{DAY_NAMES[daySlot.date.getDay()]}</p>
                          <p className="text-lg font-bold leading-tight">{daySlot.date.getDate()}</p>
                          <p className="text-[9px] opacity-70">{MONTH_NAMES[daySlot.date.getMonth()]}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time slots */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-3">
                      <Clock className="size-3" />
                      Créneaux disponibles — {formatDate(availableSlots[selectedDateIdx]?.date)}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {availableSlots[selectedDateIdx]?.slots.map(slot => (
                        <motion.button
                          key={slot}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            selectedSlot === slot
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary"
                          }`}
                        >
                          {slot}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-primary/10 border border-primary/20 p-3 mb-4 flex items-center gap-3"
                    >
                      <Calendar className="size-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-primary">Créneau sélectionné</p>
                        <p className="text-xs text-muted-foreground">{formatDate(availableSlots[selectedDateIdx]?.date)} à {selectedSlot}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("form")} className="rounded-xl gap-1">
                      <ChevronLeft className="size-4" /> Retour
                    </Button>
                    <Button
                      className="flex-1 rounded-xl gap-2"
                      disabled={!selectedSlot}
                      onClick={handleConfirm}
                    >
                      Confirmer le rendez-vous <CheckCircle className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── DONE ── */}
              {step === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="size-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Rendez-vous confirmé !</h3>
                  <p className="text-muted-foreground text-sm mb-1">
                    Nous vous rappelons le <span className="text-primary font-semibold">
                      {availableSlots[selectedDateIdx] && formatDate(availableSlots[selectedDateIdx].date)}
                    </span> à <span className="text-primary font-semibold">{selectedSlot}</span>.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">Un email de confirmation vous a été envoyé. L'audit dure 30 minutes.</p>
                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-left mb-6">
                    <p className="text-xs font-bold text-primary mb-2">Ce qui vous attend lors de l'audit</p>
                    {["Analyse complète de votre présence en ligne", "Recommandations personnalisées", "Estimation budgétaire transparente", "Aucun engagement, aucune obligation"].map((item) => (
                      <div key={item} className="flex items-center gap-2 mt-1.5">
                        <CheckCircle className="size-3 text-primary flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleClose} variant="outline" className="rounded-xl">Fermer</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
