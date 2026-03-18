import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft, Phone, Calendar, ClipboardList, BarChart3, Users,
  TrendingUp, Clock, Eye, MousePointerClick, ChevronLeft, Package,
  Trash2, Download, RefreshCw, Search, Filter, Star, Globe,
  LayoutGrid, ShoppingBag, Mail, CheckCircle, XCircle, AlertCircle,
  Activity, PieChart, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookingEntry {
  nom: string; prenom: string; email: string; telephone: string;
  secteur: string; besoin: string; date: string; time: string; createdAt: string;
}
interface AuditRequest {
  nom: string; prenom: string; email: string; telephone: string;
  secteur: string; besoin: string; createdAt: string;
}
interface ProductRequest {
  nom: string; prenom: string; email: string; telephone: string;
  secteur: string; product: string; createdAt: string;
}
interface DiagnosticEntry {
  answers: string[]; date: string;
}

type TabId = "overview" | "leads" | "bookings" | "diagnostics" | "products" | "settings";

const OFFER_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  "Visibilité": { color: "#22c55e", icon: Globe, label: "Visibilité" },
  "Autorité": { color: "#6366f1", icon: LayoutGrid, label: "Autorité" },
  "Conversion": { color: "#f59e0b", icon: ShoppingBag, label: "Conversion" },
  "Site internet": { color: "#22c55e", icon: Globe, label: "Site internet" },
  "Contenu marketing": { color: "#6366f1", icon: Star, label: "Contenu marketing" },
  "Automatisation": { color: "#f59e0b", icon: Zap, label: "Automatisation" },
};

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("overview");
  const [diagnostics, setDiagnostics] = useState<DiagnosticEntry[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [auditRequests, setAuditRequests] = useState<AuditRequest[]>([]);
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOffer, setFilterOffer] = useState("all");
  const [filterSector, setFilterSector] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [bookingStatus, setBookingStatus] = useState<Record<string, "confirmed" | "cancelled" | "pending">>({});

  const reload = () => {
    setDiagnostics(JSON.parse(localStorage.getItem("diagnostics") || "[]"));
    setBookings(JSON.parse(localStorage.getItem("bookings") || "[]"));
    setAuditRequests(JSON.parse(localStorage.getItem("audit_requests") || "[]"));
    setProductRequests(JSON.parse(localStorage.getItem("product_requests") || "[]"));
    setBookingStatus(JSON.parse(localStorage.getItem("booking_status") || "{}"));
  };

  useEffect(() => { reload(); }, []);

  const saveBookingStatus = (key: string, status: "confirmed" | "cancelled" | "pending") => {
    const next = { ...bookingStatus, [key]: status };
    setBookingStatus(next);
    localStorage.setItem("booking_status", JSON.stringify(next));
  };

  const deleteEntry = (type: string, idx: number) => {
    const key = type === "audit" ? "audit_requests" : type === "product" ? "product_requests" : type === "booking" ? "bookings" : "diagnostics";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(arr));
    reload();
  };

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  };

  // ── KPIs ──
  const totalLeads = auditRequests.length + productRequests.length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((_, i) => bookingStatus[`${i}`] === "confirmed").length;
  const conversionRate = totalLeads > 0 ? Math.round((totalBookings / totalLeads) * 100) : 0;
  const todayBookings = bookings.filter(b => b.date === new Date().toLocaleDateString("fr-FR")).length;

  // ── Charts data ──
  const sectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    [...auditRequests, ...productRequests].forEach(r => {
      const s = r.secteur || "Inconnu";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [auditRequests, productRequests]);

  const offerData = useMemo(() => {
    const counts: Record<string, number> = {};
    productRequests.forEach(r => {
      counts[r.product] = (counts[r.product] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [productRequests]);

  const weeklyActivity = useMemo(() => {
    const days: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("fr-FR");
      days[key] = 0;
    }
    [...auditRequests, ...productRequests].forEach(r => {
      const d = new Date(r.createdAt).toLocaleDateString("fr-FR");
      if (d in days) days[d]++;
    });
    return Object.entries(days);
  }, [auditRequests, productRequests]);
  const maxWeekly = Math.max(...weeklyActivity.map(([, v]) => v), 1);

  // ── Filtered data ──
  const filteredAudit = useMemo(() => auditRequests.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || `${r.nom} ${r.prenom} ${r.email} ${r.telephone}`.toLowerCase().includes(q);
    const matchSector = filterSector === "all" || r.secteur === filterSector;
    return matchSearch && matchSector;
  }), [auditRequests, searchQuery, filterSector]);

  const filteredBookings = useMemo(() => bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return !q || `${b.nom} ${b.prenom} ${b.email} ${b.telephone}`.toLowerCase().includes(q);
  }), [bookings, searchQuery]);

  const filteredProducts = useMemo(() => productRequests.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || `${r.nom} ${r.prenom} ${r.email}`.toLowerCase().includes(q);
    const matchOffer = filterOffer === "all" || r.product === filterOffer;
    return matchSearch && matchOffer;
  }), [productRequests, searchQuery, filterOffer]);

  const allSectors = useMemo(() => [...new Set([...auditRequests, ...productRequests].map(r => r.secteur).filter(Boolean))], [auditRequests, productRequests]);
  const allOffers = useMemo(() => [...new Set(productRequests.map(r => r.product).filter(Boolean))], [productRequests]);

  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "leads", label: "Leads", icon: Users, count: filteredAudit.length },
    { id: "bookings", label: "Rendez-vous", icon: Calendar, count: filteredBookings.length },
    { id: "products", label: "Offres", icon: Package, count: filteredProducts.length },
    { id: "diagnostics", label: "Diagnostics", icon: ClipboardList, count: diagnostics.length },
    { id: "settings", label: "Paramètres", icon: Activity },
  ];

  const KPICard = ({ label, value, icon: Icon, color, sub }: any) => (
    <div className="card-surface p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        <Icon className="size-4" style={{ color }} />
      </div>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );

  const StatusBadge = ({ status }: { status?: string }) => {
    if (status === "confirmed") return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"><CheckCircle className="size-3" />Confirmé</span>;
    if (status === "cancelled") return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400"><XCircle className="size-3" />Annulé</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400"><AlertCircle className="size-3" />En attente</span>;
  };

  const SearchBar = () => (
    <div className="flex gap-3 mb-5 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher..."
          className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-all"
        />
      </div>
      {tab === "leads" && (
        <select value={filterSector} onChange={e => setFilterSector(e.target.value)} className="bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-primary outline-none">
          <option value="all">Tous secteurs</option>
          {allSectors.map(s => <option key={s}>{s}</option>)}
        </select>
      )}
      {tab === "products" && (
        <select value={filterOffer} onChange={e => setFilterOffer(e.target.value)} className="bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-primary outline-none">
          <option value="all">Toutes offres</option>
          {allOffers.map(o => <option key={o}>{o}</option>)}
        </select>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40 glass-strong">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="size-4" /> Site
          </Button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold">Studio Nova — Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={reload} className="gap-1.5 text-xs">
            <RefreshCw className="size-3.5" /> Actualiser
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            En ligne
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 border-r border-border min-h-[calc(100vh-57px)] p-3 sticky top-[57px] flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSelectedItem(null); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="flex items-center gap-2.5"><t.icon className="size-4" />{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{t.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 p-6 max-w-5xl">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-black mb-1">Dashboard</h2>
                <p className="text-sm text-muted-foreground">Vue d'ensemble de l'activité Studio Nova</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Total Leads" value={totalLeads} icon={Users} color="#6366f1" sub={`${auditRequests.length} audits + ${productRequests.length} offres`} />
                <KPICard label="Rendez-vous" value={totalBookings} icon={Calendar} color="hsl(var(--primary))" sub={`${confirmedBookings} confirmés`} />
                <KPICard label="Conversion" value={`${conversionRate}%`} icon={TrendingUp} color="#22c55e" sub="Leads → RDV" />
                <KPICard label="Aujourd'hui" value={todayBookings} icon={Clock} color="#f59e0b" sub="RDV planifiés" />
              </div>

              {/* Activity chart */}
              <div className="card-surface p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Activity className="size-4 text-primary" /> Activité des 7 derniers jours
                </h3>
                <div className="flex items-end gap-2 h-24">
                  {weeklyActivity.map(([date, count], i) => (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground font-medium">{count > 0 ? count : ""}</span>
                      <div
                        className="w-full rounded-t-md bg-primary/60 transition-all duration-500 min-h-[4px]"
                        style={{ height: `${(count / maxWeekly) * 72}px` }}
                      />
                      <span className="text-[9px] text-muted-foreground">{date.slice(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Sectors */}
                <div className="card-surface p-6">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><PieChart className="size-4 text-primary" />Secteurs</h3>
                  {sectorData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune donnée</p>
                  ) : sectorData.slice(0, 6).map(([s, n]) => {
                    const max = sectorData[0][1];
                    return (
                      <div key={s} className="mb-3">
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{s}</span><span className="font-semibold">{n}</span></div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(n / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Offers */}
                <div className="card-surface p-6">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Package className="size-4 text-primary" />Offres demandées</h3>
                  {offerData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune donnée</p>
                  ) : offerData.map(([offer, count]) => {
                    const cfg = OFFER_CONFIG[offer];
                    const max = offerData[0][1];
                    return (
                      <div key={offer} className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5" style={{ color: cfg?.color || "currentColor" }}>
                            {cfg && <cfg.icon className="size-3" />}{offer}
                          </span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, backgroundColor: cfg?.color || "hsl(var(--primary))" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent activity */}
              <div className="card-surface p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Eye className="size-4 text-primary" />Dernières activités</h3>
                <div className="space-y-2">
                  {[
                    ...auditRequests.map((a, i) => ({ type: "Audit", name: `${a.prenom} ${a.nom}`, detail: a.secteur, date: a.createdAt, color: "#6366f1" })),
                    ...bookings.map((b, i) => ({ type: "RDV", name: `${b.prenom} ${b.nom}`, detail: `${b.date} ${b.time}`, date: b.createdAt, color: "hsl(var(--primary))" })),
                    ...productRequests.map((p, i) => ({ type: p.product, name: `${p.prenom} ${p.nom}`, detail: p.secteur, date: p.createdAt, color: OFFER_CONFIG[p.product]?.color || "#f59e0b" })),
                  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${item.color}20`, color: item.color }}>{item.type}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.detail}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  ))}
                  {totalLeads + totalBookings === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune activité</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {tab === "leads" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-black mb-0.5">Leads — Audits</h2>
                  <p className="text-sm text-muted-foreground">{filteredAudit.length} lead{filteredAudit.length > 1 ? "s" : ""}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(auditRequests, "leads-audits.csv")} className="gap-2">
                  <Download className="size-4" /> Export CSV
                </Button>
              </div>
              <SearchBar />

              {selectedItem ? (
                <div className="card-surface p-6">
                  <button onClick={() => setSelectedItem(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
                    <ChevronLeft className="size-4" /> Retour
                  </button>
                  <h3 className="text-xl font-bold mb-5">{selectedItem.prenom} {selectedItem.nom}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {[
                      { label: "Email", value: selectedItem.email, icon: Mail },
                      { label: "Téléphone", value: selectedItem.telephone, icon: Phone },
                      { label: "Secteur", value: selectedItem.secteur, icon: Filter },
                      { label: "Besoin", value: selectedItem.besoin || "Audit général", icon: Package },
                      { label: "Date", value: new Date(selectedItem.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), icon: Calendar },
                    ].map(f => (
                      <div key={f.label} className="bg-secondary/50 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <f.icon className="size-3 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{f.label}</p>
                        </div>
                        <p className="text-sm font-medium">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.open(`tel:${selectedItem.telephone}`)}>
                      <Phone className="size-3.5" /> Appeler
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.open(`mailto:${selectedItem.email}`)}>
                      <Mail className="size-3.5" /> Envoyer email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="card-surface overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        {["Date", "Nom", "Email", "Téléphone", "Secteur", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAudit.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Aucun lead</td></tr>
                      ) : filteredAudit.map((r, i) => (
                        <tr key={i} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                          <td className="px-4 py-3 font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedItem(r)}>{r.prenom} {r.nom}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{r.email}</td>
                          <td className="px-4 py-3 text-xs">{r.telephone}</td>
                          <td className="px-4 py-3"><span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{r.secteur}</span></td>
                          <td className="px-4 py-3">
                            <button onClick={() => { if (confirm("Supprimer ce lead ?")) deleteEntry("audit", auditRequests.indexOf(r)); }} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab === "bookings" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-black mb-0.5">Rendez-vous</h2>
                  <p className="text-sm text-muted-foreground">{filteredBookings.length} rendez-vous planifié{filteredBookings.length > 1 ? "s" : ""}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(bookings, "rendez-vous.csv")} className="gap-2">
                  <Download className="size-4" /> Export CSV
                </Button>
              </div>
              <SearchBar />

              <div className="space-y-3">
                {filteredBookings.length === 0 ? (
                  <div className="card-surface p-10 text-center text-muted-foreground">Aucun rendez-vous</div>
                ) : filteredBookings.map((b, i) => {
                  const status = bookingStatus[`${bookings.indexOf(b)}`] || "pending";
                  return (
                    <div key={i} className="card-surface p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{b.prenom} {b.nom}</p>
                          <p className="text-xs text-muted-foreground">{b.telephone} · {b.secteur}</p>
                        </div>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className="text-sm font-bold text-primary">{b.date}</p>
                        <p className="text-xs text-muted-foreground">{b.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                        <select
                          value={status}
                          onChange={e => saveBookingStatus(`${bookings.indexOf(b)}`, e.target.value as any)}
                          className="text-xs bg-secondary border border-border rounded-lg px-2 py-1 text-foreground focus:border-primary outline-none"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <button onClick={() => { if (confirm("Supprimer ce RDV ?")) deleteEntry("booking", bookings.indexOf(b)); }} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-black mb-0.5">Demandes d'offres</h2>
                  <p className="text-sm text-muted-foreground">{filteredProducts.length} demande{filteredProducts.length > 1 ? "s" : ""}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(productRequests, "demandes-offres.csv")} className="gap-2">
                  <Download className="size-4" /> Export CSV
                </Button>
              </div>
              <SearchBar />

              <div className="card-surface overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40">
                      {["Date", "Nom", "Email", "Offre", "Secteur", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Aucune demande</td></tr>
                    ) : filteredProducts.map((r, i) => {
                      const cfg = OFFER_CONFIG[r.product];
                      return (
                        <tr key={i} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                          <td className="px-4 py-3 font-medium">{r.prenom} {r.nom}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{r.email}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit" style={{ background: `${cfg?.color || "#6366f1"}20`, color: cfg?.color || "#6366f1" }}>
                              {cfg && <cfg.icon className="size-3" />}{r.product}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{r.secteur}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { if (confirm("Supprimer cette demande ?")) deleteEntry("product", productRequests.indexOf(r)); }} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DIAGNOSTICS ── */}
          {tab === "diagnostics" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-black mb-0.5">Diagnostics</h2>
                  <p className="text-sm text-muted-foreground">{diagnostics.length} diagnostic{diagnostics.length > 1 ? "s" : ""} réalisé{diagnostics.length > 1 ? "s" : ""}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportCSV(diagnostics.map(d => ({ date: d.date, secteur: d.answers[0], site: d.answers[1], demandes: d.answers[2], reseaux: d.answers[3], taches: d.answers[4] })), "diagnostics.csv")} className="gap-2">
                  <Download className="size-4" /> Export CSV
                </Button>
              </div>

              {selectedItem ? (
                <div className="card-surface p-6">
                  <button onClick={() => setSelectedItem(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
                    <ChevronLeft className="size-4" /> Retour
                  </button>
                  <h3 className="text-xl font-bold mb-5">Diagnostic — {new Date(selectedItem.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</h3>
                  <div className="space-y-3">
                    {["Secteur d'activité", "Site internet existant", "Demandes clients digitales", "Présence réseaux sociaux", "Tâches répétitives"].map((q, i) => (
                      <div key={q} className="bg-secondary/50 rounded-xl p-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{q}</p>
                        <p className="text-sm font-medium">{selectedItem.answers[i] || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card-surface overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        {["Date", "Secteur", "Site existant", "Demandes clients", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostics.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Aucun diagnostic</td></tr>
                      ) : diagnostics.map((d, i) => (
                        <tr key={i} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString("fr-FR")}</td>
                          <td className="px-4 py-3 font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedItem(d)}>{d.answers[0] || "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{d.answers[1] || "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{d.answers[2] || "—"}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { if (confirm("Supprimer ce diagnostic ?")) deleteEntry("diagnostic", i); }} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === "settings" && (
            <div>
              <h2 className="text-2xl font-display font-black mb-5">Paramètres</h2>
              <div className="space-y-4">
                <div className="card-surface p-6">
                  <h3 className="font-semibold mb-2 text-destructive flex items-center gap-2"><Trash2 className="size-4" />Zone dangereuse</h3>
                  <p className="text-sm text-muted-foreground mb-4">Ces actions sont irréversibles. Toutes les données sont stockées localement dans votre navigateur.</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: "Supprimer tous les leads", key: "audit_requests" },
                      { label: "Supprimer tous les RDV", key: "bookings" },
                      { label: "Supprimer toutes les demandes", key: "product_requests" },
                      { label: "Supprimer tous les diagnostics", key: "diagnostics" },
                    ].map(action => (
                      <Button
                        key={action.key}
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
                        onClick={() => {
                          if (confirm(`Supprimer toutes les données "${action.label}" ?`)) {
                            localStorage.removeItem(action.key);
                            reload();
                          }
                        }}
                      >
                        <Trash2 className="size-3.5" /> {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="card-surface p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><MousePointerClick className="size-4 text-primary" />Lien Calendly</h3>
                  <p className="text-sm text-muted-foreground mb-3">Pour connecter votre vrai calendrier Google, créez un compte sur <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">calendly.com</a>, connectez votre Google Calendar, et remplacez l'URL dans le code.</p>
                  <div className="bg-secondary/50 rounded-xl p-3 font-mono text-xs text-muted-foreground">
                    {`// Dans AuditFormModal.tsx, remplacez les créneaux statiques`}<br />
                    {`// par : <InlineWidget url="https://calendly.com/VOTRE-LIEN" />`}
                  </div>
                </div>

                <div className="card-surface p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Activity className="size-4 text-primary" />Statistiques stockage</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Leads audits", value: auditRequests.length },
                      { label: "Rendez-vous", value: bookings.length },
                      { label: "Demandes offres", value: productRequests.length },
                      { label: "Diagnostics", value: diagnostics.length },
                    ].map(s => (
                      <div key={s.label} className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-primary">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
