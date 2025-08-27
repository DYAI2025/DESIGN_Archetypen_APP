import React, { useEffect, useMemo, useRef, useState } from "react";

// === Archetype 3D Card Showroom (Stakeholder Preview) ===
// Single-file React component. Uses Tailwind CSS. No external libs required.
// - Fullscreen 3D showroom (CSS perspective) with ring/grid layouts
// - Flip-on-click cards with front (symbol) + back (short description)
// - Three style kits: Minimal, ArtDeco, Mystical (default)
// - Autopan camera + mouse parallax for an epic presentation without extra setup

export default function ArchetypeShowroom() {
  // --- Controls (default: zero-effort stakeholder mode) ---
  const [layout, setLayout] = useState("ring"); // "ring" | "grid"
  const [styleKit, setStyleKit] = useState("mystical"); // mystical | minimal | artdeco
  const [lang, setLang] = useState("de"); // de | en
  const [autopan, setAutopan] = useState(true);
  const [flipAll, setFlipAll] = useState(false);

  const stageRef = useRef(null);
  const tRef = useRef(0);

  // Camera autopan
  useEffect(() => {
    let raf;
    const loop = () => {
      if (!stageRef.current) return;
      tRef.current += autopan ? 0.005 : 0; // slower = calmer
      const ry = (Math.sin(tRef.current) * 20).toFixed(3);
      const rx = (Math.cos(tRef.current * 0.5) * 6 + -4).toFixed(3);
      stageRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [autopan]);

  // Mouse parallax (adds to autopan)
  useEffect(() => {
    const onMove = (e) => {
      if (!stageRef.current) return;
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w - 0.5) * 2; // [-1,1]
      const ny = (e.clientY / h - 0.5) * 2;
      const extraY = nx * 10; // yaw
      const extraX = -ny * 6; // pitch
      stageRef.current.style.setProperty("--extra-rot-x", `${extraX.toFixed(2)}deg`);
      stageRef.current.style.setProperty("--extra-rot-y", `${extraY.toFixed(2)}deg`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const data = useMemo(() => getArchetypeData(), []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0b0e] text-white">
      {/* HUD */}
      <div className="absolute z-50 top-4 left-4 flex flex-col gap-2">
        <div className="px-3 py-2 rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-lg">
          <h1 className="text-lg font-semibold tracking-wide">Archetypen Karten – Stakeholder Preview</h1>
          <p className="text-xs opacity-80">Interaktives 3D-Interieur • Flip-Karten • {data.length} Archetypen</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={layout} onChange={setLayout} label="Layout" options={[
            {label: "Ring", value: "ring"},
            {label: "Grid", value: "grid"},
          ]} />
          <Select value={styleKit} onChange={setStyleKit} label="Style" options={[
            {label: "Mystisch", value: "mystical"},
            {label: "Minimal", value: "minimal"},
            {label: "Art-Deco", value: "artdeco"},
          ]} />
          <Select value={lang} onChange={setLang} label="Sprache" options={[
            {label: "DE", value: "de"},
            {label: "EN", value: "en"},
          ]} />
          <Button onClick={() => setFlipAll(v => !v)}>{flipAll ? "Alles: Front" : "Alles: Rückseite"}</Button>
          <Button onClick={() => setAutopan(v => !v)}>{autopan ? "Autopan aus" : "Autopan an"}</Button>
        </div>
      </div>

      {/* Room BG */}
      <RoomBackground />

      {/* 3D Stage */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          ref={stageRef}
          className="relative will-change-transform"
          style={{
            perspective: "1800px",
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out",
          }}
        >
          <CardRingOrGrid
            items={data}
            layout={layout}
            styleKit={styleKit}
            lang={lang}
            flipAll={flipAll}
          />
        </div>
      </div>

      {/* Floor reflection gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

function RoomBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Subtle starry gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,50,70,0.6),rgba(5,6,9,0.9))]" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(0,0,0,0.6))]" />
      {/* Soft noise */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light" style={{backgroundImage:
        "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "3px 3px"}} />
      {/* Ground plane hint */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent" />
    </div>
  );
}

function CardRingOrGrid({ items, layout, styleKit, lang, flipAll }) {
  const radius = 950; // distance from center in px
  const cols = 6;
  const gap = 160;

  return (
    <div
      className="relative"
      style={{ transformStyle: "preserve-3d" }}
    >
      {items.map((it, i) => {
        const angle = (360 / items.length) * i;
        const ringTransform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const gridX = (col - (cols - 1) / 2) * gap;
        const gridY = (row - 1) * 240; // 3 rows
        const gridTransform = `translate3d(${gridX}px, ${gridY}px, 0px)`;
        return (
          <div
            key={it.id}
            className="absolute"
            style={{
              transformStyle: "preserve-3d",
              transform: layout === "ring" ? ringTransform : gridTransform,
              transition: "transform 0.8s cubic-bezier(.2,.8,.2,1)",
            }}
          >
            <Card item={it} styleKit={styleKit} lang={lang} flipAll={flipAll} />
          </div>
        );
      })}
    </div>
  );
}

function Card({ item, styleKit, lang, flipAll }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped(v => !v);
  useEffect(() => setFlipped(flipAll), [flipAll]);

  return (
    <button
      onClick={toggle}
      className="relative"
      style={{
        width: 260,
        height: 420,
        transformStyle: "preserve-3d",
        transition: "transform 0.7s cubic-bezier(.2,.8,.2,1)",
        transform: `rotateY(${flipped ? 180 : 0}deg)`,
      }}
      aria-label={item.title.de}
      title={item.title.de}
    >
      {/* FRONT */}
      <div
        className="absolute inset-0 rounded-2xl shadow-2xl"
        style={{
          backfaceVisibility: "hidden",
          background: getCardBg(item.color, styleKit),
          border: getBorder(styleKit, item.color),
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-between p-5">
          {/* Frame accent */}
          <FrameAccent styleKit={styleKit} color={item.color} />

          {/* Symbol */}
          <div className="flex-1 w-full flex items-center justify-center">
            <Icon type={item.symbol} color={item.color} />
          </div>

          {/* Title */}
          <div className="w-full text-center">
            <h3 className={titleClass(styleKit)}>{item.title["de"]}</h3>
            <p className="text-xs opacity-70 tracking-wider">{item.code}</p>
          </div>
        </div>
      </div>

      {/* BACK */}
      <div
        className="absolute inset-0 rounded-2xl shadow-2xl"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: backBg(styleKit),
          border: getBorder(styleKit, item.color),
        }}
      >
        <div className="flex h-full w-full flex-col p-5">
          <div className="mb-3">
            <h3 className={titleClass(styleKit)}>{item.title[lang]}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs opacity-80">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: item.color }}
              />
              <span>{item.color}</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
            {item.desc[lang]}
          </p>
          <div className="mt-auto pt-4 text-[10px] opacity-60">Icon: {item.symbol}
          </div>
        </div>
      </div>
    </button>
  );
}

function titleClass(styleKit) {
  switch (styleKit) {
    case "minimal":
      return "text-lg font-semibold tracking-wide";
    case "artdeco":
      return "text-xl font-semibold tracking-[0.15em] uppercase";
    default:
      return "text-xl font-semibold tracking-wide"; // mystical
  }
}

function getCardBg(color, styleKit) {
  if (styleKit === "minimal") return `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), ${color}`;
  if (styleKit === "artdeco") return `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08), transparent 60%), ${color}`;
  // mystical
  return `radial-gradient(circle at 50% 35%, rgba(255,255,255,0.10), transparent 65%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.15)), ${color}`;
}
function backBg(styleKit) {
  if (styleKit === "minimal") return "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)) #0f1116";
  if (styleKit === "artdeco") return "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.07), transparent 60%) #0e1015";
  return "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2)) #0d0f14"; // mystical
}
function getBorder(styleKit, color) {
  const col = tinyShift(color, styleKit === "artdeco" ? 0.08 : 0.04);
  return `1px solid ${col}`;
}

function FrameAccent({ styleKit, color }) {
  if (styleKit === "minimal") return null;
  if (styleKit === "artdeco") {
    return (
      <div className="absolute inset-3 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 rounded-2xl border" style={{ borderColor: tinyShift(color, 0.15) }} />
        <div className="absolute inset-6 rounded-xl border" style={{ borderColor: tinyShift(color, 0.25) }} />
      </div>
    );
  }
  // mystical
  return (
    <div className="absolute inset-3 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 60px ${tinyAlpha(color, 0.25)}` }} />
      <div className="absolute -inset-1 rounded-2xl opacity-30" style={{ background: `radial-gradient(60% 60% at 50% 30%, ${tinyAlpha(color,0.18)}, transparent)` }} />
    </div>
  );
}

// ==== Icons (clean, monoline SVG) ====
function Icon({ type, color }) {
  const stroke = "#fff";
  const common = { fill: "none", stroke, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const size = 140;
  const box = 200;
  const ct = (d) => <path d={d} {...common} />;
  const circle = (cx, cy, r) => <circle cx={cx} cy={cy} r={r} {...common} />;
  const line = (x1,y1,x2,y2) => <line x1={x1} y1={y1} x2={x2} y2={y2} {...common} />;

  let svg;
  switch (type) {
    case "sword": // Held
      svg = (
        <>
          {line(100,30,100,150)}
          {ct("M100 30 L110 45 L90 45 Z")} {/* tip */}
          {ct("M85 150 L115 150 L110 165 L90 165 Z")} {/* guard */}
          {ct("M88 165 L112 165 L112 175 L88 175 Z")} {/* grip */}
        </>
      );
      break;
    case "bowl": // Fürsorgende
      svg = (
        <>
          {ct("M40 110 Q100 150 160 110")} 
          {ct("M50 110 Q100 130 150 110")} 
          {ct("M40 110 Q100 190 160 110")}
        </>
      );
      break;
    case "sunbeam": // Unschuldige
      svg = (
        <>
          {circle(100,100,26)}
          {[...Array(12)].map((_,i)=>{
            const a=i*Math.PI/6; const r1=40, r2=80;
            return <line key={i} x1={100+Math.cos(a)*r1} y1={100+Math.sin(a)*r1} x2={100+Math.cos(a)*r2} y2={100+Math.sin(a)*r2} {...common}/>;
          })}
        </>
      );
      break;
    case "heart": // Liebende
      svg = (
        <>
          {ct("M100 150 C60 120 50 90 70 75 C85 65 100 75 100 85 C100 75 115 65 130 75 C150 90 140 120 100 150 Z")}        
        </>
      );
      break;
    case "staff": // Magier
      svg = (
        <>
          {ct("M80 160 L120 40")} 
          {circle(125,35,12)}
          {ct("M76 140 Q85 130 92 135")}        
        </>
      );
      break;
    case "book": // Weise
      svg = (
        <>
          {ct("M60 60 L140 60 L140 150 L60 150 Z")} 
          {line(100,60,100,150)}
          {line(70,75,90,75)}
          {line(110,75,130,75)}
        </>
      );
      break;
    case "crystal": // Schöpfer
      svg = (
        <>
          {ct("M100 30 L150 80 L120 170 L80 170 L50 80 Z")} 
          {line(100,30,100,170)}
          {line(150,80,50,80)}
        </>
      );
      break;
    case "compass": // Entdecker
      svg = (
        <>
          {circle(100,100,60)}
          {ct("M100 55 L115 115 L85 115 Z")} 
          {ct("M100 145 L115 85 L85 85 Z")} 
        </>
      );
      break;
    case "mask": // Narr
      svg = (
        <>
          {ct("M60 70 Q100 40 140 70 Q130 140 100 150 Q70 140 60 70 Z")} 
          {circle(85,95,6)}
          {circle(115,95,6)}
          {ct("M80 120 Q100 130 120 120")} 
        </>
      );
      break;
    case "bolt": // Rebell
      svg = (
        <>
          {ct("M110 40 L70 110 L100 110 L90 160 L140 90 L110 90 Z")} 
        </>
      );
      break;
    case "crown": // Herrscher
      svg = (
        <>
          {ct("M50 130 L150 130 L150 150 L50 150 Z")} 
          {ct("M50 130 L70 80 L100 120 L130 80 L150 130 Z")} 
          {circle(70,80,4)}
          {circle(130,80,4)}
        </>
      );
      break;
    case "key": // Jedermensch
      svg = (
        <>
          {circle(80,90,18)}
          {line(97,90,150,90)}
          {line(140,90,140,100)}
          {line(130,90,130,100)}
        </>
      );
      break;
    case "mirror": // Ego
      svg = (
        <>
          {ct("M60 60 L140 60 L140 150 L60 150 Z")}
          {ct("M65 70 L135 70 M70 80 L130 80 M75 90 L125 90")} 
        </>
      );
      break;
    case "moonsun": // Anima
      svg = (
        <>
          {circle(85,100,26)}
          {ct("M115 74 A26 26 0 1 0 115 126 A20 20 0 1 1 115 74 Z")} 
        </>
      );
      break;
    case "silhouette": // Schatten
      svg = (
        <>
          {ct("M75 80 Q100 60 125 80 Q130 100 115 115 Q135 125 130 150 Q100 160 70 150 Q65 125 85 115 Q70 100 75 80 Z")} 
          {ct("M82 80 Q100 68 118 80")}
        </>
      );
      break;
    case "wreath": // Diplomat (Kranz)
      svg = (
        <>
          {circle(100,100,44)}
          {ct("M65 110 Q70 120 80 125 Q90 130 95 140")} 
          {ct("M135 110 Q130 120 120 125 Q110 130 105 140")} 
        </>
      );
      break;
    case "scales": // Waage
      svg = (
        <>
          {line(60,70,140,70)}
          {line(100,70,100,130)}
          {ct("M70 70 Q70 100 60 110 Q80 110 90 100 Q85 85 70 70 Z")} 
          {ct("M130 70 Q130 100 140 110 Q120 110 110 100 Q115 85 130 70 Z")} 
        </>
      );
      break;
    case "gears": // NPC
      svg = (
        <>
          {circle(75,115,22)}
          {circle(120,85,16)}
          {line(75,92,75,138)}
          {line(53,115,97,115)}
          {line(120,69,120,101)}
          {line(104,85,136,85)}
        </>
      );
      break;
    default:
      svg = circle(100,100,50);
  }

  return (
    <svg viewBox="0 0 200 200" className="w-[140px] h-[140px] opacity-95">
      {svg}
    </svg>
  );
}

function tinyShift(hex, amt=0.1) {
  // lighten/darken hex by amt (0..1)
  try {
    const { r,g,b } = hexToRgb(hex);
    const L = (x) => Math.max(0, Math.min(255, Math.round(x + (255 - x)*amt)));
    const r2=L(r), g2=L(g), b2=L(b);
    return `rgba(${r2}, ${g2}, ${b2}, 0.9)`;
  } catch { return "rgba(255,255,255,0.2)"; }
}
function tinyAlpha(hex, a=0.2) {
  try { const { r,g,b } = hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; } catch { return `rgba(255,255,255,${a})`; }
}
function hexToRgb(hex) {
  const c = hex.replace("#","");
  const bigint = parseInt(c,16);
  if (c.length===6) {
    return { r:(bigint>>16)&255, g:(bigint>>8)&255, b:bigint&255 };
  }
  throw new Error("hex format");
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm">
      {children}
    </button>
  );
}
function Select({ value, onChange, label, options }) {
  return (
    <label className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm flex items-center gap-2">
      <span className="opacity-80">{label}</span>
      <select
        className="bg-transparent outline-none"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      >
        {options.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

// === Data ===
function getArchetypeData() {
  const items = [
    { id:"A01", code:"A01", symbol:"sword", color:"#D64B3B", title:{de:"Held", en:"Hero"}, desc:{
      de:"Geht Risiken ein, stellt sich Prüfungen und mobilisiert Mut, um das Gute zu erreichen.",
      en:"Embraces challenge and risk, mobilizing courage to achieve the good."}},
    { id:"A02", code:"A02", symbol:"bowl", color:"#47A773", title:{de:"Fürsorgende", en:"Caregiver"}, desc:{
      de:"Schützt, nährt und stärkt andere; verwandelt Mitgefühl in konkrete Taten.",
      en:"Protects, nourishes, and strengthens others; turns compassion into action."}},
    { id:"A03", code:"A03", symbol:"sunbeam", color:"#EDE6D6", title:{de:"Unschuldige", en:"Innocent"}, desc:{
      de:"Vertraut dem Leben, sucht Klarheit, Einfachheit und das Gute im Menschen.",
      en:"Trusts life, seeks clarity and simplicity, and looks for the good in people."}},
    { id:"A04", code:"A04", symbol:"heart", color:"#E04E9B", title:{de:"Liebende", en:"Lover"}, desc:{
      de:"Sucht Nähe, Verbundenheit und Hingabe; macht Beziehungen lebendig.",
      en:"Seeks closeness, devotion, and vibrant connection in relationships."}},
    { id:"A05", code:"A05", symbol:"staff", color:"#6A4DF5", title:{de:"Magier", en:"Magician"}, desc:{
      de:"Gestaltet Wandel durch Einsicht und Intuition; verbindet Wissen mit Staunen.",
      en:"Shapes change through insight and intuition; blends knowledge with wonder."}},
    { id:"A06", code:"A06", symbol:"book", color:"#D4AF37", title:{de:"Weise", en:"Sage"}, desc:{
      de:"Sucht Wahrheit, teilt Erkenntnis und denkt in langen Linien.",
      en:"Seeks truth, shares insight, and thinks in long timelines."}},
    { id:"A07", code:"A07", symbol:"crystal", color:"#FF8A3D", title:{de:"Schöpfer", en:"Creator"}, desc:{
      de:"Verwandelt Visionen in Form; baut, entwirft, komponiert.",
      en:"Turns vision into form; builds, designs, composes."}},
    { id:"A08", code:"A08", symbol:"compass", color:"#2BB0C1", title:{de:"Entdecker", en:"Explorer"}, desc:{
      de:"Folgt der Neugier, überschreitet Grenzen und findet Wege im Unbekannten.",
      en:"Follows curiosity, crosses borders, and charts paths in the unknown."}},
    { id:"A09", code:"A09", symbol:"mask", color:"#B7D03D", title:{de:"Narr", en:"Jester"}, desc:{
      de:"Bringt Leichtigkeit, Humor und Perspektivwechsel; löst Spannung spielerisch.",
      en:"Brings lightness, humor, and perspective shifts; diffuses tension playfully."}},
    { id:"A10", code:"A10", symbol:"bolt", color:"#E5554F", title:{de:"Rebell", en:"Rebel"}, desc:{
      de:"Stellt Regeln infrage, bricht Muster auf und kämpft für Freiheit.",
      en:"Questions rules, breaks patterns, and fights for freedom."}},
    { id:"A11", code:"A11", symbol:"crown", color:"#3A66C3", title:{de:"Herrscher", en:"Ruler"}, desc:{
      de:"Schafft Ordnung, trifft Entscheidungen und trägt Verantwortung fürs Ganze.",
      en:"Creates order, makes decisions, and carries responsibility for the whole."}},
    { id:"A12", code:"A12", symbol:"key", color:"#9B8C7B", title:{de:"Jedermensch", en:"Everyman"}, desc:{
      de:"Sucht Zugehörigkeit, Verlässlichkeit und das Bodenständige des Alltags.",
      en:"Seeks belonging, reliability, and everyday groundedness."}},

    // Structure/Extended
    { id:"S13", code:"S13", symbol:"mirror", color:"#C0C6D0", title:{de:"Ego", en:"Ego"}, desc:{
      de:"Zentriert Wille und Abgrenzung; setzt Prioritäten und sagt \"Ich\".",
      en:"Centers will and boundaries; sets priorities and says 'I'."}},
    { id:"S14", code:"S14", symbol:"moonsun", color:"#C056FF", title:{de:"Anima", en:"Anima"}, desc:{
      de:"Verbindet innere Polaritäten; öffnet für Feinfühligkeit und Resonanz.",
      en:"Bridges inner polarities; opens to sensitivity and resonance."}},
    { id:"S15", code:"S15", symbol:"silhouette", color:"#1C1B22", title:{de:"Schatten", en:"Shadow"}, desc:{
      de:"Bündelt Verdrängtes und Ungelebtes; lädt zur ehrlichen Integration ein.",
      en:"Gathers the repressed and unlived; invites honest integration."}},

    // Extras
    { id:"X16", code:"X16", symbol:"wreath", color:"#1FA3B1", title:{de:"Diplomat", en:"Diplomat"}, desc:{
      de:"Vermittelt zwischen Positionen, schafft Vertrauen und tragfähige Kompromisse.",
      en:"Mediates positions, building trust and durable compromise."}},
    { id:"X17", code:"X17", symbol:"scales", color:"#5BAE9A", title:{de:"Waage", en:"Balancer"}, desc:{
      de:"Hält Gegensätze im Gleichgewicht, urteilt besonnen und fair.",
      en:"Keeps opposites in balance; judges with calm fairness."}},
    { id:"X18", code:"X18", symbol:"gears", color:"#6D7278", title:{de:"NPC", en:"NPC"}, desc:{
      de:"Wirkt mechanisch und prozessorientiert; steht für routinierte Abläufe.",
      en:"Mechanical, process-oriented; represents routinized operations."}},
  ];
  return items;
}
