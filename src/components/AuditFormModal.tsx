import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditModal } from "@/contexts/AuditModalContext";
import { supabase } from "@/integrations/supabase/client";

const secteurs = ["Artisan BTP", "Restauration", "Commerce", "Santé", "Immobilier", "Tourisme", "Services", "Autre"];
const besoins = ["Site vitrine", "E-commerce", "Refonte de site", "SEO / Référencement", "Automatisation", "Autre"];
const timeSlots = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

function getWeekDays(offset: number) {
  const days: Date[] = [];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

const AuditFormModal = () => {
  const { isOpen, productType, close } = useAuditModal();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", secteur: "", besoin: "" });
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const weekDays = getWeekDays(weekOffset);
  const canSubmitForm = form.prenom && form.nom && form.email && form.secteur;

  const handleClose = () => { close(); setStep(0); setForm({ prenom: "", nom: "", email: "", telephone: "", secteur: "", besoin: productType || "" }); setSelectedDay(null); setSelectedTime(""); setWeekOffset(0); };

  const submitBooking = async () => {
    if (!selectedDay || !selectedTime) return;
    setSubmitting(true);
    const dateStr = selectedDay.toISOString().split("T")[0];
    const base = { prenom: form.prenom, nom: form.nom, email: form.email, telephone: form.telephone || null, secteur: form.secteur, besoin: form.besoin || null };
    await Promise.all([
      supabase.from("audit_requests" as any).insert({ ...base, besoin: form.besoin || null } as any),
      supabase.from("bookings" as any).insert({ ...base, date: dateStr, time: selectedTime, status: "pending" } as any),
    ]);
    setSubmitting(false);
    setStep(2);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg card-surface p-8 z-10 max-h-[90vh] overflow-y-auto">
          <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>

          {step === 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Demander un audit gratuit</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Prénom *" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} className="bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                  <input placeholder="Nom *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className="bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                </div>
                <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                <input placeholder="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                <select value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary">
                  <option value="">Secteur d'activité *</option>
                  {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={form.besoin} onChange={e => setForm({ ...form, besoin: e.target.value })} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary">
                  <option value="">Votre besoin</option>
                  {besoins.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <Button className="w-full mt-6 bg-primary text-primary-foreground rounded-xl" disabled={!canSubmitForm} onClick={() => setStep(1)}>
                Choisir mon créneau <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-6"><Calendar className="inline size-5 mr-2" />Choisir un créneau</h3>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setWeekOffset(w => w - 1)} className="text-sm text-muted-foreground hover:text-foreground">← Sem. préc.</button>
                <button onClick={() => setWeekOffset(w => w + 1)} className="text-sm text-muted-foreground hover:text-foreground">Sem. suiv. →</button>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {weekDays.map(d => (
                  <button key={d.toISOString()} onClick={() => { setSelectedDay(d); setSelectedTime(""); }}
                    className={`p-3 rounded-xl text-center text-sm transition-all ${selectedDay?.toDateString() === d.toDateString() ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>
                    <div className="font-medium">{d.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                    <div className="text-lg font-bold">{d.getDate()}</div>
                  </button>
                ))}
              </div>
              {selectedDay && (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {timeSlots.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${selectedTime === t ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>{t}</button>
                  ))}
                </div>
              )}
              {selectedDay && selectedTime && (
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  📅 {selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}
                </p>
              )}
              <Button className="w-full bg-primary text-primary-foreground rounded-xl" disabled={!selectedDay || !selectedTime || submitting} onClick={submitBooking}>
                {submitting ? "Envoi..." : "Confirmer mon rendez-vous"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <CheckCircle className="size-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Rendez-vous confirmé !</h3>
              {selectedDay && <p className="text-muted-foreground mb-6">{selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}</p>}
              <ul className="text-sm text-left space-y-2 max-w-xs mx-auto mb-6">
                {["Analyse de votre situation", "Recommandations personnalisées", "Plan d'action concret", "Sans engagement"].map(t => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle className="size-4 text-primary" />{t}</li>
                ))}
              </ul>
              <Button variant="outline" onClick={handleClose} className="rounded-xl">Fermer</Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditFormModal;
