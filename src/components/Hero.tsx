import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenAuditForm: () => void;
}

const Hero = ({ onOpenAuditForm }: HeroProps) => {
  const reassurance = [
    { icon: Shield, text: "Audit gratuit et sans engagement" },
    { icon: Clock, text: "Réponse sous 24h" },
    { icon: Users, text: "Accompagnement sur mesure" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden grain">
      {/* ── Globe terrestre animé ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="relative w-[600px] h-[600px] opacity-[0.18]">
          {/* Sphère principale */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 35% 35%, hsl(var(--primary) / 0.9) 0%, hsl(220 70% 30% / 0.6) 40%, hsl(220 60% 10% / 0.95) 100%)",
              boxShadow:
                "inset -30px -30px 80px hsl(220 80% 5% / 0.8), inset 20px 20px 60px hsl(var(--primary) / 0.3), 0 0 120px hsl(var(--primary) / 0.15)",
            }}
          />

          {/* Continents SVG animés — rotation */}
          <svg
            className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
            viewBox="0 0 600 600"
            style={{ animation: "globeSpin 28s linear infinite" }}
          >
            <defs>
              <clipPath id="globeClip">
                <circle cx="300" cy="300" r="298" />
              </clipPath>
              <radialGradient id="globeShine" cx="35%" cy="30%" r="55%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g clipPath="url(#globeClip)" fill="hsl(var(--primary))" opacity="0.75">
              {/* Europe / Africa */}
              <path d="M290 140 C300 130 320 135 325 150 L330 175 C335 190 328 210 315 220 L300 235 C290 245 275 240 270 225 L265 200 C260 180 272 155 290 140Z" />
              <path d="M275 245 C285 240 300 245 308 260 L318 290 C325 315 318 345 302 360 L285 375 C270 385 255 378 250 360 L245 330 C240 305 252 270 275 245Z" />
              {/* Americas */}
              <path d="M155 160 C165 150 182 155 188 170 L195 195 C200 215 192 238 178 248 L162 260 C148 268 135 260 132 242 L128 215 C124 192 138 173 155 160Z" />
              <path d="M145 275 C158 268 175 275 180 292 L188 320 C195 350 186 385 168 398 L148 410 C130 420 115 410 112 390 L108 358 C104 330 120 290 145 275Z" />
              {/* Asia */}
              <path d="M370 130 C395 120 430 128 445 148 L460 178 C472 205 465 240 445 255 L415 268 C390 278 368 265 362 242 L356 210 C350 182 358 148 370 130Z" />
              {/* Australia */}
              <path d="M410 360 C425 352 445 358 452 375 L460 400 C466 420 458 444 442 452 L420 460 C400 466 385 455 382 435 L378 408 C375 385 390 368 410 360Z" />
            </g>

            {/* Lignes de latitude */}
            {[150, 220, 300, 380, 450].map((y) => (
              <ellipse
                key={y}
                cx="300"
                cy={y}
                rx={Math.sqrt(Math.max(0, 298 * 298 - (y - 300) * (y - 300)))}
                ry="6"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.15"
                strokeWidth="1"
                clipPath="url(#globeClip)"
              />
            ))}

            {/* Lignes de longitude */}
            {[0, 45, 90, 135].map((angle) => (
              <ellipse
                key={angle}
                cx="300"
                cy="300"
                rx="60"
                ry="298"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.12"
                strokeWidth="1"
                transform={`rotate(${angle} 300 300)`}
                clipPath="url(#globeClip)"
              />
            ))}

            {/* Reflet */}
            <circle cx="300" cy="300" r="298" fill="url(#globeShine)" clipPath="url(#globeClip)" />
          </svg>

          {/* Anneau orbital */}
          <div
            className="absolute inset-[-10%] rounded-full border border-primary/10"
            style={{ animation: "orbitRing 20s linear infinite" }}
          />
          <div
            className="absolute inset-[-20%] rounded-full border border-primary/5"
            style={{ animation: "orbitRing 35s linear infinite reverse" }}
          />

          {/* Point lumineux orbital */}
          <div
            className="absolute w-3 h-3 rounded-full bg-primary/60 blur-[2px]"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
              animation: "orbitDot 8s linear infinite",
              boxShadow: "0 0 12px hsl(var(--primary))",
            }}
          />
        </div>
      </div>

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-10 blur-[180px] animate-float"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(300 80% 60%))" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-8 blur-[120px]"
        style={{ background: "hsl(var(--premium-gold))", animation: "float 8s ease-in-out infinite reverse" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <style>{`
        @keyframes globeSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitRing {
          from { transform: rotate(0deg) scale(1.05); }
          to   { transform: rotate(360deg) scale(1.05); }
        }
        @keyframes orbitDot {
          from { transform: rotate(0deg) translateX(310px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(310px) rotate(-360deg); }
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
        >
          <Star className="size-3.5 text-primary fill-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Agence digitale — Aveyron &amp; Occitanie
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[0.95] mb-8 tracking-tight"
        >
          Artisans, commerçants, agences immobilières : votre entreprise mérite un site qui{" "}
          <span className="text-gradient">travaille pour vous</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Nous aidons les PME et TPE en Aveyron et en Occitanie à attirer plus de clients grâce à un site web performant, du contenu marketing percutant et des automatisations qui vous font gagner du temps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <Button
            size="lg"
            className="group bg-primary text-primary-foreground hover:brightness-110 text-base px-8 py-6 rounded-xl animate-pulse-glow transition-all duration-300"
            onClick={onOpenAuditForm}
          >
            Réserver mon audit gratuit
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="glass border-border/50 text-foreground hover:bg-secondary text-base px-8 py-6 rounded-xl transition-all duration-300 hover:border-primary/30"
            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          >
            Découvrir nos services
          </Button>
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex justify-center mb-8"
        >
          <div className="glass rounded-2xl px-6 py-3 flex items-center gap-4 text-sm">
            <div className="flex -space-x-2">
              {["🧑‍🔧", "🏪", "🏠", "🍽️"].map((e, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-base"
                >
                  {e}
                </span>
              ))}
            </div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-semibold">+50 entreprises</span> locales nous font confiance
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {reassurance.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2.5 text-sm text-muted-foreground glass rounded-full px-4 py-2"
            >
              <Icon className="size-4 text-primary" />
              <span>{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
