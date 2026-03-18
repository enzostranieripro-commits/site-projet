const metiers = [
  "Artisan BTP", "Restaurateur", "Commerçant", "Photographe", "Thérapeute",
  "Immobilier", "Tourisme", "Coach", "Architecte", "Fleuriste",
  "Vétérinaire", "Auto-école", "Comptable", "Kinésithérapeute", "Traiteur",
  "Électricien", "Paysagiste", "Ostéopathe",
];

const MetiersTicker = () => (
  <div className="py-6 overflow-hidden border-y border-border/30 mask-fade-x">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...metiers, ...metiers].map((m, i) => (
        <span key={i} className="mx-6 text-sm text-muted-foreground/60 font-medium">{m}</span>
      ))}
    </div>
  </div>
);

export default MetiersTicker;
