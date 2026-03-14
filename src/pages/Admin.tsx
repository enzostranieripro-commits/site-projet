import { useState, useEffect } from "react";
import { ArrowLeft, Phone, Calendar, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DiagnosticEntry {
  answers: string[];
  date: string;
}

interface BookingEntry {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  secteur: string;
  besoin: string;
  description: string;
  date: string;
  time: string;
  createdAt: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"diagnostics" | "bookings">("diagnostics");
  const [diagnostics, setDiagnostics] = useState<DiagnosticEntry[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);

  useEffect(() => {
    setDiagnostics(JSON.parse(localStorage.getItem("diagnostics") || "[]"));
    setBookings(JSON.parse(localStorage.getItem("bookings") || "[]"));
  }, []);

  const tabs = [
    { id: "diagnostics" as const, label: "Réponses diagnostic", icon: ClipboardList },
    { id: "bookings" as const, label: "Réservations audit", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="size-4 mr-2" /> Retour
        </Button>
        <h1 className="text-lg font-bold">Dashboard Admin</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "diagnostics" && (
          <div className="card-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Secteur</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Site existant</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Demandes clients</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Aucune réponse pour le moment</td></tr>
                ) : (
                  diagnostics.map((d, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="px-4 py-3">{new Date(d.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3">{d.answers[0] || "—"}</td>
                      <td className="px-4 py-3">{d.answers[1] || "—"}</td>
                      <td className="px-4 py-3">{d.answers[2] || "—"}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Phone className="size-3 mr-1" /> Appeler
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "bookings" && (
          <div className="card-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date RDV</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Heure</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nom</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Secteur</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Besoin</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Aucune réservation pour le moment</td></tr>
                ) : (
                  bookings.map((b, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="px-4 py-3">{new Date(b.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3">{b.time}</td>
                      <td className="px-4 py-3">{b.prenom} {b.nom}</td>
                      <td className="px-4 py-3">{b.email}</td>
                      <td className="px-4 py-3">{b.secteur}</td>
                      <td className="px-4 py-3">{b.besoin}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
