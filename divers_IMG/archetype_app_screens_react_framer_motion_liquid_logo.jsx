import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Archetype App – single-file prototype using ONLY:
 * - Framer Motion animation patterns (inspired by Awesome Framer)
 * - uiGradients palette presets for dynamic backgrounds
 * - Liquid logo effect via SVG filters (as in liquid-logo repos)
 * - Linear gradient transitions (react-native-linear-gradient concept replicated in web CSS)
 *
 * TailwindCSS utility classes are used for layout & color (allowed per project CI).
 */

// ------------------------------------------------------------
// Gradient presets (derived from uiGradients)
// ------------------------------------------------------------
const UI_GRADIENTS = [
  {
    name: "Deep Space",
    css: "radial-gradient(120% 90% at 50% 50%, #001122 0%, #0b1a2c 55%, #13243c 100%)",
  },
  {
    name: "Moonlit Asteroid",
    css: "radial-gradient(120% 90% at 50% 50%, #001122 0%, #0d2034 55%, #091628 100%)",
  },
  {
    name: "Indigo Nebula",
    css: "radial-gradient(120% 90% at 50% 50%, #001122 0%, #0a1e31 55%, #1b2d50 100%)",
  },
];

// ------------------------------------------------------------
// Micro components (Awesome Framer style building blocks)
// ------------------------------------------------------------
function Stars({ count = 90 }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 149) % 100}%`,
            top: `${(i * 89) % 100}%`,
            background: `rgba(255,255,255,${0.18 + ((i % 7) / 24)})`,
            filter: "drop-shadow(0 0 2px rgba(255,255,255,0.65))",
          }}
          animate={{ y: [0, -8 - (i % 6), 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: (i % 10) * 0.12 }}
        />
      ))}
    </div>
  );
}

function GradientScene({ idx = 0 }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ background: [UI_GRADIENTS[idx % UI_GRADIENTS.length].css, UI_GRADIENTS[(idx + 1) % UI_GRADIENTS.length].css, UI_GRADIENTS[(idx + 2) % UI_GRADIENTS.length].css] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Liquid logo – pure SVG filter (inspired by liquid-logo repos)
function LiquidLogo({ label = "ARCHETYPEN", w = 560 }) {
  return (
    <div className="relative mx-auto mt-8 select-none" style={{ width: w }}>
      <svg viewBox="0 0 560 120" className="w-full h-auto">
        <defs>
          <filter id="liquid">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.015" numOctaves="2" seed="7">
              <animate attributeName="baseFrequency" values="0.006 0.014;0.010 0.018;0.006 0.014" dur="9s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>
          <linearGradient id="gold" x1="0" x2="1">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="50%" stopColor="#FFC857" />
            <stop offset="100%" stopColor="#FFD479" />
          </linearGradient>
        </defs>
        <g filter="url(#liquid)">
          <text x="50%" y="58%" textAnchor="middle" fontSize="52" fontWeight="600" letterSpacing="0.35em" fill="url(#gold)" stroke="#3a2a0c" strokeWidth="1.5">
            {label}
          </text>
        </g>
      </svg>
      {/* shimmer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: "0 12px 60px rgba(255,179,71,0.28)" }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3.6, repeat: Infinity }}
      />
    </div>
  );
}

function GlowButton({ children, onClick, accent = "#40E0D0", locked = false }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={locked}
      className={`group relative w-full overflow-hidden rounded-2xl border px-6 py-4 text-left backdrop-blur-md ${locked ? "border-white/8 bg-white/4 text-slate-400 cursor-not-allowed" : "border-white/10 bg-white/10 text-slate-100"}`}
      whileHover={locked ? undefined : { scale: 1.02 }}
      whileTap={locked ? undefined : { scale: 0.98 }}
    >
      {!locked && (
        <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${accent}22, transparent)` }} transition={{ duration: 0.4 }} />
      )}
      <div className="relative flex items-center justify-between">
        <span className="text-lg tracking-wide">{children}</span>
        <span className="text-xl" style={{ color: accent }}>{locked ? "🔒" : "→"}</span>
      </div>
    </motion.button>
  );
}

function CardFrame({ children }) {
  return (
    <div className="relative aspect-[3/4] w-40 rounded-3xl bg-gradient-to-b from-[#0f1c2a] to-[#0b1420] border border-[#7ddfc6]/20 shadow-[0_8px_40px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: "inset 0 0 40px rgba(125,223,198,0.08)" }} />
      <motion.div className="absolute -inset-6 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(125,223,198,0.2) 42%, transparent 44%), repeating-conic-gradient(from 0deg, rgba(125,223,198,0.25) 0 2deg, transparent 2deg 6deg)" }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
      {children}
    </div>
  );
}

function ProgressBar({ value, total }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <motion.div className="h-full" style={{ background: "linear-gradient(90deg, #40E0D0, #7ddfc6)" }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
    </div>
  );
}

// ------------------------------------------------------------
// Screens
// ------------------------------------------------------------
function HomeScreen({ go, unlockedAll, unlockedPairs }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#001122] text-slate-100">
      <GradientScene idx={0} />
      <Stars />

      {/* top floating cards like in screenshot */}
      <div className="relative z-10 mx-auto grid max-w-3xl grid-cols-2 gap-8 pt-14">
        <CardFrame>
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border border-[#7ddfc6]/50">
              <span className="text-[#7ddfc6]/80 text-2xl">?</span>
            </div>
            <span className="tracking-[0.25em] text-[10px] text-[#7ddfc6]/70">ARCHETYP</span>
          </div>
        </CardFrame>
        <CardFrame>
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border border-[#7ddfc6]/50">
              <span className="text-[#7ddfc6]/80 text-2xl">?</span>
            </div>
            <span className="tracking-[0.25em] text-[10px] text-[#7ddfc6]/70">ARCHETYP</span>
          </div>
        </CardFrame>
      </div>

      <LiquidLogo label="ARCHETYPEN" />

      {/* Subline */}
      <div className="relative z-10 mt-2 text-center">
        <span className="text-[10px] tracking-[0.65em] text-slate-300/60">WORDTHREAD</span>
      </div>

      {/* Menu */}
      <div className="relative z-10 mx-auto mt-8 flex w-full max-w-3xl flex-col gap-4 px-6">
        <GlowButton onClick={() => go("all") } locked={!unlockedAll}>ALLE ARCHETYPEN</GlowButton>
        <GlowButton onClick={() => go("pairs") } locked={!unlockedPairs}>DEIN ERDUNG / CHALLENGE / HARMONIE</GlowButton>
        <GlowButton onClick={() => go("about")}>WAS SIND ARCHETYPEN?</GlowButton>
      </div>

      <div className="h-24" />
    </div>
  );
}

// Alte Fragenlogik entfernt - wird durch Word Thread Algorithmus ersetzt
// const SAMPLE_QUESTIONS = [
//   { id: "Q1", text: "Wenn das Unbekannte ruft – folgst du dem Ruf?", archetype: "Explorer" },
//   { id: "Q2", text: "Wo verwandelst du Chaos in Form?", archetype: "Creator" },
//   { id: "Q3", text: "Wessen Wohl stellst du vor dein eigenes?", archetype: "Caregiver" },
//   { id: "Q4", text: "Welcher Wert ist dir unverhandelbar?", archetype: "Ruler" },
//   { id: "Q5", text: "Worüber staunst du wie ein Kind?", archetype: "Innocent" },
// ];

// WordThread Interface Platzhalter
function WordThreadInterface({ onComplete }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#001122] text-slate-100">
      <GradientScene idx={1} />
      <Stars />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-16">
        <h2 className="text-2xl md:text-3xl font-medium leading-snug drop-shadow-[0_0_12px_rgba(125,223,198,0.25)] text-center">
          Word Thread Integration
        </h2>
        <p className="mt-4 text-slate-300 text-center">
          Hier wird die Word Thread Technologie integriert für die Archetyp-Ermittlung
        </p>
        
        <div className="mt-8 text-center">
          <GlowButton onClick={onComplete} accent="#7ddfc6">
            Zurück zur Übersicht
          </GlowButton>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}

function AllArchetypesScreen({ go }) {
  const names = ["Innocent", "Hero", "Caregiver", "Explorer", "Rebel", "Lover", "Creator", "Jester", "Sage", "Magician", "Ruler", "Everyman"];
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#001122] text-slate-100">
      <GradientScene idx={2} />
      <Stars />
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-16">
        <h2 className="text-2xl tracking-widest text-slate-200/90">ALLE ARCHETYPEN</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {names.map((n) => (
            <motion.div key={n} className="relative rounded-2xl border border-white/10 bg-white/5 p-4" whileHover={{ y: -3 }}>
              <div className="text-sm tracking-widest opacity-80">{n}</div>
              <div className="mt-2 h-24 rounded-xl bg-gradient-to-br from-white/5 to-white/0" />
            </motion.div>
          ))}
        </div>
        <div className="mt-8">
          <GlowButton onClick={() => go("home")}>Zurück</GlowButton>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

function PairingsScreen({ go }) {
  const chips = [
    { k: "Erdungs‑Archetyp", c: "#79f2d0" },
    { k: "Challenge‑Archetyp", c: "#FF073A" },
    { k: "Harmonie‑Archetyp", c: "#FFB347" },
  ];
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#001122] text-slate-100">
      <GradientScene idx={1} />
      <Stars />
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-16">
        <h2 className="text-2xl tracking-widest text-slate-200/90">DEINE DYNAMIK</h2>
        <div className="mt-6 grid gap-4">
          {chips.map(({ k, c }) => (
            <motion.div key={k} className="relative rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden" whileHover={{ y: -2 }}>
              <motion.div className="absolute -inset-0.5 opacity-0" style={{ background: `conic-gradient(from 0deg, transparent, ${c}33, transparent)` }} whileHover={{ opacity: 0.4 }} />
              <div className="relative z-10 flex items-center justify-between">
                <div className="tracking-widest">{k}</div>
                <div className="text-xs opacity-70">freigeschaltet</div>
              </div>
              <div className="relative z-10 mt-3 h-24 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0" />
            </motion.div>
          ))}
        </div>
        <div className="mt-8"><GlowButton onClick={() => go("home")}>Zurück</GlowButton></div>
      </div>
      <div className="h-16" />
    </div>
  );
}

function AboutScreen({ go }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#001122] text-slate-100">
      <GradientScene idx={0} />
      <Stars />
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-16">
        <h2 className="text-2xl tracking-widest text-slate-200/90">WAS SIND ARCHETYPEN?</h2>
        <p className="mt-4 text-slate-300/90 leading-relaxed">
          Archetypen sind dynamische Muster deiner Psyche – Momentaufnahmen, keine Etiketten. Diese App zeigt dir,
          welche Kräfte gerade wirken und wie sie zusammen spielen. Texte & Analysen folgen in voller Länge.
        </p>
        <div className="mt-8"><GlowButton onClick={() => go("home")}>Zurück</GlowButton></div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Root – flow & gating
// ------------------------------------------------------------
export default function App() {
  const [screen, setScreen] = useState("home");
  const [completed, setCompleted] = useState(false);
  const [subscribed] = useState(false); // toggle in real app after purchase

  const unlockedAll = completed; // unlocked after first run
  const unlockedPairs = completed && subscribed; // unlocked with subscription

  const go = (s) => setScreen(s);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen go={go} unlockedAll={unlockedAll} unlockedPairs={unlockedPairs} />
          </motion.div>
        )}
        {screen === "wordthread" && (
          <motion.div key="wordthread" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WordThreadInterface onComplete={() => { setCompleted(true); setScreen("all"); }} />
          </motion.div>
        )}
        {screen === "all" && (
          <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AllArchetypesScreen go={go} />
          </motion.div>
        )}
        {screen === "pairs" && (
          <motion.div key="pairs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PairingsScreen go={go} />
          </motion.div>
        )}
        {screen === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AboutScreen go={go} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
