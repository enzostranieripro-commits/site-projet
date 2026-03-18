import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";

const AdminSettingsTab = ({
  leads, bookings, diagnostics, products, fetchAll
}: {
  leads: any[]; bookings: any[]; diagnostics: any[]; products: any[];
  fetchAll: () => void;
}) => {
  const [pricing, setPricing] = useState<Record<string, number>>({ "Visibilité": 297, "Autorité": 497, "Conversion": 797 });
  const [suspension, setSuspension] = useState({ enabled: true, delay_days: 15 });
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("admin_settings" as any).select("*") as any;
      if (data) {
        const p = data.find((d: any) => d.key === "offer_pricing");
        const s = data.find((d: any) => d.key === "auto_suspension");
        if (p) setPricing(p.value);
        if (s) setSuspension(s.value);
      }
    };
    load();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    await Promise.all([
      supabase.from("admin_settings" as any).update({ value: pricing, updated_at: new Date().toISOString() } as any).eq("key", "offer_pricing"),
      supabase.from("admin_settings" as any).update({ value: suspension, updated_at: new Date().toISOString() } as any).eq("key", "auto_suspension"),
    ]);
    setSaving(false);
    toast("Paramètres sauvegardés ✓");
  };

  const runPaymentCheck = async () => {
    setChecking(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await supabase.functions.invoke("check-payments");
      if (res.error) throw res.error;
      toast("✅ Vérification des paiements effectuée");
      fetchAll();
    } catch (e: any) {
      toast.error("Erreur: " + (e.message || "Échec de la vérification"));
    }
    setChecking(false);
  };

  const offerColor = (o: string) =>
    o === "Visibilité" ? "text-visibility border-visibility/30" :
    o === "Autorité" ? "text-primary border-primary/30" :
    "text-conversion border-conversion/30";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Pricing config */}
      <div className="card-surface p-6">
        <h3 className="font-semibold mb-4">💰 Tarifs par offre</h3>
        <p className="text-xs text-muted-foreground mb-4">Ces tarifs sont pré-remplis automatiquement lorsque vous classifiez un client.</p>
        <div className="grid grid-cols-3 gap-4">
          {(["Visibilité", "Autorité", "Conversion"] as const).map(offer => (
            <div key={offer} className={`border rounded-xl p-4 ${offerColor(offer)}`}>
              <p className="text-sm font-semibold mb-2">{offer}</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={pricing[offer] || 0}
                  onChange={e => setPricing(prev => ({ ...prev, [offer]: Number(e.target.value) }))}
                  className="w-full bg-secondary rounded-lg px-3 py-2 text-lg font-extrabold outline-none"
                />
                <span className="text-sm font-medium">€/mois</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-suspension */}
      <div className="card-surface p-6">
        <h3 className="font-semibold mb-4">🔒 Suspension automatique</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Lorsqu'un client est en retard de paiement au-delà du délai configuré, son accès sera automatiquement suspendu.
        </p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={suspension.enabled}
              onChange={e => setSuspension(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm">Activer la suspension automatique</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">après</span>
            <input type="number" value={suspension.delay_days}
              onChange={e => setSuspension(prev => ({ ...prev, delay_days: Number(e.target.value) }))}
              className="w-16 bg-secondary rounded-lg px-3 py-1.5 text-sm font-semibold outline-none text-center" />
            <span className="text-sm text-muted-foreground">jours de retard</span>
          </div>
        </div>
      </div>

      {/* Save + Manual check */}
      <div className="flex gap-3">
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="size-4 mr-2" />{saving ? "Enregistrement..." : "Sauvegarder les paramètres"}
        </Button>
        <Button variant="outline" onClick={runPaymentCheck} disabled={checking}>
          <RefreshCw className={`size-4 mr-2 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Vérification..." : "Vérifier les paiements maintenant"}
        </Button>
      </div>

      {/* Danger zone */}
      <div className="card-surface p-6">
        <h3 className="font-semibold text-destructive mb-4">Zone dangereuse</h3>
        <div className="space-y-3">
          {[{ table: "audit_requests", label: "leads" }, { table: "bookings", label: "rendez-vous" }, { table: "product_requests", label: "demandes produits" }, { table: "diagnostics", label: "diagnostics" }].map(t => (
            <Button key={t.table} variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={async () => { if (confirm(`Supprimer tous les ${t.label} ?`)) { await supabase.from(t.table as any).delete().neq("id", "00000000-0000-0000-0000-000000000000"); fetchAll(); toast(`${t.label} supprimés`); } }}>
              Supprimer tous les {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="card-surface p-6">
        <h3 className="font-semibold mb-3">Statistiques globales</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Total leads</p><p className="font-bold text-lg">{leads.length}</p></div>
          <div><p className="text-muted-foreground">Total RDV</p><p className="font-bold text-lg">{bookings.length}</p></div>
          <div><p className="text-muted-foreground">Total diagnostics</p><p className="font-bold text-lg">{diagnostics.length}</p></div>
          <div><p className="text-muted-foreground">Total demandes produits</p><p className="font-bold text-lg">{products.length}</p></div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
