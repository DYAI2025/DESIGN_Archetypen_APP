Technischer Auftrag – Doppelgesicht‑Karten (Entwicklung) v1.0

Version: 1.0 • Ersetzt den alten „Design‑Auftrag: Archetypen‑App & Kartenserie“ für die Entwicklerinnen‑Perspektive.

0. Zweck & Kontext

Dieses Dokument definiert Anforderungen für die Implementierung des neuen Doppelgesicht‑Kartendesigns (Primär‑ & Schatten‑Archetyp, „Modern Mystic Tech“ als Hauptstil, „Retro‑Cyborg“ als Varianten‑Pack). Es umfasst Frontend‑Komponenten, Datenmodell/Backend‑Schnittstellen, Asset‑Pipeline, Analytics, A11y, Moderation/Security und Abnahmekriterien.

1. Geltungsbereich (Scope)

In Scope

Interaktive Card‑Komponente mit Flip/Expand, Parallax‑Tilt, Layer‑Blend (face_primary, face_shadow, mandala, texture_overlay, symbol).

Datenmodell ArchetypeCardV2 inkl. Verweisen auf Marker‑Snippets (Explainability) und Konfidenzen.

API‑Endpunkte für Karte, Session und Klassifikation.

Internationalisierung (DE/EN) für Kartentitel, Back‑Copy, CTA.

Analytics‑Events: card_impression, card_expand, session_start, conversion_freemium_to_premium.

Moderation/PII‑Masking bei Snippets.

Out of Scope (MVP)

Community‑Funktionen, langfristige Coaching‑Journeys, Custom‑Archetypen‑Editor.

2. Architektur & Tech‑Stack

Frontend: React + Next.js (App Router), TypeScript, CSS Modules oder Tailwind. GSAP/Framer Motion für Flip/Parallax zulässig.

Backend: Node/TypeScript oder kompatibel; REST API (JSON). Feature‑Flags via LaunchDarkly/ENV‑Toggles.

Storage/CDN: Assets (PNG‑Layer, SVG) auf CDN; Cache‑Headers mit ETag.

Build/CI: PNPM/Yarn, Linting (ESLint), Prettier, CI‑Pipelines (Build, Unit, E2E‑Smoke), Sentry/Log‑Aggregation.

3. Datenmodell
3.1 Entity: ArchetypeCardV2
{
  "id": "card_abcdef",
  "primary": { "code": "NAVIGATOR", "label": {"de": "Navigator", "en": "Navigator"}, "confidence": 0.71 },
  "shadow": { "code": "DOUBTER", "label": {"de": "Zweifler", "en": "Doubter"}, "confidence": 0.63 },
  "variant": "standard|retro_cyborg|organic_watercolor",
  "palette": { "main": "#8AE6E0", "bg": "#121314", "accent": "#D9B8FF" },
  "assets": {
    "face_primary": "https://cdn/.../card_abcdef/face_primary.png",
    "face_shadow": "https://cdn/.../card_abcdef/face_shadow.png",
    "mandala": "https://cdn/.../card_abcdef/mandala.png",
    "texture_overlay": "https://cdn/.../card_abcdef/texture_overlay.png",
    "symbol_svg": "https://cdn/.../symbols/sextant.svg"
  },
  "back_copy": { "de": "120–200 Wörter …", "en": "120–200 words …" },
  "snippets": [
    {"id":"m1","text":"…","loc":"/transcript#t=13.2","evidence":true},
    {"id":"m2","text":"…","loc":"/transcript#t=51.0","evidence":true}
  ],
  "audit": {"model":"vX.Y","ts":"2025-08-15T12:00:00Z"}
}
3.2 Entity: TimelineEvent
{ "id":"evt_123", "type":"session_start|answer|card_expand", "user_id":"…", "card_id":"card_abcdef", "ts":"…", "meta":{}}
4. API‑Spezifikation (REST)

GET /cards/:id → liefert ArchetypeCardV2.

GET /cards?primary=…&shadow=…&variant=… → Query, Paginierung optional.

POST /session.start → { user_id?, locale } → { session_id }.

POST /session.answer → { session_id, payload } → { status }.

POST /classify/archetype → { session_id } → { primary, shadow, confidence, card_id }.

Rate‑Limits: 60 rpm IP‑basiert; 429 bei Überschreitung.

Auth: JWT/Bearer, CORS eingeschränkt, HTTPS only.

5. Asset‑Pipeline & Formate

Layer: PNG‑24, sRGB, Alpha, @3x, Keyline 1–1.5 px (Standard), Glow ≤ 8% (Standard), RGB‑Aberration 1–2 px (Retro‑Cyborg).

Symbole: SVG, ViewBox 24, Stroke 1.5 px.

Previews: 1200×1800 JPG (85).

Namensschema: /cards/{card_id}/{layer}.png; /symbols/{symbol}.svg.

Fallbacks: Wenn Layer fehlt, render Standard‑Fallback ohne Flip.

6. Frontend‑Spezifikation
6.1 Card‑Komponente

Zustände: idle → hover/tilt → pressed → flipping → expanded.

Interaktionen:

Tap/Click toggelt Flip (Front ↔ Back).

Parallax‑Tilt (max 6 px, device‑motion optional).

Keyboard: Enter/Space flip; ESC schließt Expand.

Responsiv: 2:3‑Karte; Mobile Expand 9:16; Desktop Back fullscreen‑modal.

A11y: Fokus‑Ringe, aria-expanded, aria-controls, Kontrast ≥ 4.5:1, Text skalierbar bis 130%.

6.2 Motion‑Spezifikation

Flip: 680–760 ms, cubic-bezier(0.18,0.88,0.22,1); 3D‑rotateY + depth‑fade.

Parallax: X/Y 2–6 px in Abhängigkeit vom Cursor/Device.

Haptik (Mobile): 10–14 ms Tap‑Feedback.

Performance: 60 FPS Ziel; will-change: transform; GPU‑Beschleunigung.

7. Lokalisierung (i18n)

Locales: de, en (erweiterbar).

Texte: Titel, Back‑Copy, CTAs, Tooltips aus i18n‑Namespace geladen.

Formate: ISO‑Zeit/Datum in UTC im Backend, UI lokalisiert.

8. Analytics & Ereignisse

card_impression { card_id, variant, locale }

card_expand { card_id, dwell_ms, from: feed|detail }

session_start { locale, source }

conversion_freemium_to_premium { plan, card_id? }

Transport: Beacon/API, Retry‑Queue bei Offline.

9. Moderation, Privacy & Security

PII‑Masking in Snippets (Server‑seitig).

Blacklist/Transform für sensible Labels.

CSP strikt, nur CDN‑Domains.

Eingaben serverseitig validieren; Output‑Encoding (XSS‑Schutz).

Audit‑Log für Klassifikationsentscheidungen.

10. Qualitätsziele & Performance‑Budgets

Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms (Mid‑Tier Gerät), CLS ≤ 0.1.

Asset‑Budget: Erstes Rendering < 350 kB (gz), Back‑Layer lazy nachladen; Symbol‑SVG < 8 kB.

Kompatibilität: iOS 16+, Android 11+, letzte 2 Desktop‑Browser‑Versionen.

11. Tests & Abnahme

Unit: Motions‑Reducer, i18n‑Keys, Event‑Dispatch.

Integration: Flip/Parallax, Lazy‑Layer‑Load, i18n‑Switch.

E2E (CI): „voice → STT → marker → LLM → card snapshot“ Smoke.

A11y‑Checks: axe‑CI, Screenreader‑Pass.

Akzeptanzkriterien (MVP):

Karte zeigt PA & SA gemäß Classifier‑Output; ≥ 3 Marker‑Snippets klickbar.

Flip/Expand auf iOS/Android/Desktop ohne Layer‑Artefakte.

Migrationen laufen grün; keine Datenverluste.

Auto‑Follow‑ups bei Inversion conf(SA) > conf(PA); Audit‑Log.

Moderation greift; problematische Labels werden transformiert/geblockt.

Analytics‑Events feuern und erscheinen im Dashboard.

12. Deliverables (Checkliste)




13. Abhängigkeiten & Flags

Design‑Tokens & Assets: Palette, Typo, Layer von Design/Art‑Team.

Feature‑Flag: cards_v2_double_face für Rollout.

Fallback: Ohne face_shadow nur Front‑Ansicht, kein Flip.

14. Offene Punkte (zu klären)

Endgültige Archetypen‑Liste und Mappings (alt → neu) per CSV.

Back‑Copy‑Länge pro Sprache (120 vs. 200 Wörter) für A/B.

Geräte‑Whitelist für DeviceMotion (Parallax) vs. „safe default“.

CDN‑Pfadkonvention finalisieren.

Anhang A – Design‑Tokens (Auszug)

Farben: MAIN #8AE6E0, BG #121314, FOG #F3F5F7, ACCENTS #D9B8FF/#FFAF5F/#61FFA3

Line‑Weight Tokens: 1.0 / 1.25 / 1.5 px @3x

Glow Tokens: 4% / 8% / 12%

Grid: 8 px, Safe‑Areas für Titel/Snippets

Anhang B – Event‑Schemas (JSON)
{
  "event": "card_expand",
  "ts": "2025-08-27T10:20:30Z",
  "user_id": "u_…",
  "card_id": "card_abcdef",
  "variant": "retro_cyborg",
  "dwell_ms": 7431,
  "from": "feed"
}
Anhang C – OpenAPI Skizze
GET /cards/{id}
GET /cards?primary=&shadow=&variant=&page=
POST /session.start
POST /session.answer
POST /classify/archetype

Ende v1.0

Hab dir den alten Brief hübsch sezziert und in einen klaren Entwickler-Auftrag gegossen. Das Ding heißt jetzt „Technischer Auftrag – Doppelgesicht-Karten (Entwicklung) v1.0“ und liegt in der Canvas. Keine Moodboard-Poesie, sondern harte Anforderungen: Card-Komponente mit Flip/Parallax, Datenmodell, APIs, Asset-Pipeline, i18n, Analytics, Moderation, Performance-Budgets und Abnahmekriterien. Genau das, was eine Entwicklerin braucht, um zu liefern statt zu raten.

Kurz die Highlights, damit niemand die Augen verdreht:

Scope aktualisiert: Doppelgesicht-Karte (PA/SA), Layer-Rendering, Explainability-Snippets, DE/EN, Feature-Flagged Rollout.

APIs drin: GET /cards/:id, POST /session.start, POST /classify/archetype usw. mit Rate-Limits und Auth.

Datenmodell klar: ArchetypeCardV2 mit Variant, Palette, Layer-URLs, Back-Copy, Snippets, Audit.

Frontend-Spec: Flip 680–760 ms, bezier-Kurve, 60 FPS Ziel, 2:3 Karte, 9:16 Expand, a11y und Keyboard-Support.

Analytics & KPIs: Events definiert, inkl. Schema.

Security/Moderation: PII-Masking für Snippets, Label-Transform/Blacklist, CSP.

Performance-Budgets: LCP ≤ 2.5 s, Asset-Budget, Lazy-Layer-Load.

Abnahme: 6 knallharte Kriterien, damit niemand „fühlt sich fertig an“ sagen muss.