import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck } from "lucide-react";

const names = [
  "Marc D.", "Claire L.", "Sophie M.", "Pierre V.", "Léa B.", "Thomas R.",
  "Julie F.", "Antoine G.", "Nathalie P.", "Sébastien K.", "Emma C.", "Lucas H.",
];

const cities = [
  "Rodez", "Millau", "Albi", "Cahors", "Montauban", "Figeac", "Villefranche",
  "Toulouse", "Tarbes", "Auch", "Narbonne", "Castres",
];

const actions = [
  "vient de réserver son audit gratuit",
  "a demandé un devis",
  "vient de lancer son projet",
];

const SocialProofToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({ name: "", city: "", action: "" });

  useEffect(() => {
    const showNotif = () => {
      setMessage({
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    // First notification after 15s
    const initial = setTimeout(showNotif, 15000);
    // Then every 30-50s
    const interval = setInterval(showNotif, 30000 + Math.random() * 20000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-4 z-40 glass rounded-xl p-4 pr-6 flex items-center gap-3 max-w-xs shadow-lg border border-border/30"
        >
          <div className="w-10 h-10 rounded-full bg-visibility/20 flex items-center justify-center flex-shrink-0">
            <UserCheck className="size-5 text-visibility" />
          </div>
          <div>
            <p className="text-sm font-semibold">{message.name} <span className="text-muted-foreground font-normal">— {message.city}</span></p>
            <p className="text-xs text-muted-foreground">{message.action}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Il y a quelques instants</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofToast;
