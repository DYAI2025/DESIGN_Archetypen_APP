# Design-Brief: Doppelgesicht-Karten (2Face Design) v1.0

**Ersetzt:** Alten Design-Auftrag für einfache Archetyp-Karten  
**Priorität:** Hoch  
**Deadline:** TBD  

## 🎯 Neue Anforderungen: Doppelgesicht-Konzept

### Konzept-Änderung
- **Alt:** Eine Karte = Ein Archetyp
- **Neu:** Eine Karte = **Primär-Archetyp (Vorderseite) + Schatten-Archetyp (Rückseite)**
- **Interaktion:** Flip-Animation zwischen Front und Back

### Design-Varianten
1. **"Modern Mystic Tech"** (Hauptstil)
2. **"Retro-Cyborg"** (Varianten-Pack)  
3. **"Organic Watercolor"** (Optional)

---

## 📋 Technische Design-Spezifikationen

### Karten-Format & Dimensionen
- **Aspect Ratio:** 2:3 (Hochformat)
- **Auflösung:** @3x für Retina (1200×1800px final)
- **Dateiformat:** PNG-24 mit Alpha-Kanal
- **Farbraum:** sRGB
- **Kompression:** Optimiert für Web (<350kB Gesamt-Budget)

### Layer-System (5 separate PNG-Dateien pro Karte)
```
1. face_primary.png    - Vorderseite (Primär-Archetyp)
2. face_shadow.png     - Rückseite (Schatten-Archetyp)  
3. mandala.png         - Hintergrund-Ornament (beide Seiten)
4. texture_overlay.png - Textur/Effekt-Layer
5. symbol.svg          - Archetyp-Symbol (separates SVG)
```

### Responsive Verhalten
- **Mobile:** 9:16 Expand-Modus
- **Desktop:** Fullscreen Modal für Rückseite
- **Flip-Animation:** 680-760ms mit 3D-Rotation

---

## 🎨 Design-Token & Styleguide

### Farbsystem (Beispiel-Palette)
```
MAIN:    #8AE6E0  (Primärfarbe Karte)
BG:      #121314  (Dunkler Hintergrund)  
FOG:     #F3F5F7  (Heller Kontrast)
ACCENT1: #D9B8FF  (Lila-Akzent)
ACCENT2: #FFAF5F  (Orange-Akzent)
ACCENT3: #61FFA3  (Grün-Akzent)
```

### Linien & Effekte
- **Keylines:** 1.0 / 1.25 / 1.5 px @3x
- **Glow-Intensität:** 4% / 8% / 12%
- **RGB-Aberration:** 1-2 px (nur Retro-Cyborg)

### Typografie
- **Safe Areas:** 8px Grid für Titel/Text-Snippets
- **Kontrast:** Mindestens 4.5:1 für Barrierefreiheit
- **Skalierung:** Text bis 130% skalierbar

---

## 📝 Content-Integration

### Vorderseite (face_primary.png)
- **Archetyp-Name:** Z.B. "Navigator" 
- **Visueller Fokus:** Positive/helle Darstellung
- **Symbol-Integration:** Primäres Symbol eingebettet oder separat

### Rückseite (face_shadow.png)  
- **Schatten-Archetyp:** Z.B. "Zweifler"
- **Visueller Kontrast:** Dunklere/kritischere Darstellung
- **Text-Integration:** 120-200 Wörter Back-Copy (DE/EN)
- **Snippet-Bereiche:** Platz für 3+ klickbare Marker-Snippets

### Mandala-Layer (mandala.png)
- **Funktion:** Einheitlicher Hintergrund für beide Seiten
- **Stil:** Mystisch-technisch, je nach Variante angepasst
- **Transparenz:** Ermöglicht Layer-Blending

---

## 🔄 Interaktion & Animation (Design-Berücksichtigung)

### Flip-Transition
- **Dauer:** 680-760ms
- **Easing:** cubic-bezier(0.18,0.88,0.22,1)
- **3D-Effekt:** Berücksichtigung von Perspective/Depth

### Parallax-Tilt (Optional)
- **Bewegung:** 2-6px basierend auf Cursor/Device
- **Performance:** GPU-optimiert, 60 FPS

### Hover-States
- **Idle → Hover → Pressed → Flipping → Expanded**
- **Feedback:** Subtile Glows, Schatten-Änderungen

---

## 📊 Archetypen-Mapping (Beispiele)

### Primär → Schatten Paare
```
Navigator → Zweifler
Hero → Selbstzerstörer  
Caregiver → Märtyrer
Creator → Perfektionist
Magician → Manipulator
Sage → Besserwisser
Explorer → Flüchtiger
Innocent → Naiver
Jester → Zyniker
Lover → Besitzergreifer
Ruler → Tyrann
Everyman → Konformist
```

### Sonder-Archetypen
- **Ego/Persona:** Besondere Doppelgesicht-Behandlung
- **Anima/Shadow:** Meta-Archetypen mit eigenem Design
- **Wise Old Man:** Berater-Archetyp

---

## 📁 Datei-Naming & Delivery

### Struktur
```
/cards/
  /{card_id}/
    face_primary.png      (1200×1800, PNG-24)
    face_shadow.png       (1200×1800, PNG-24)  
    mandala.png           (1200×1800, PNG-24)
    texture_overlay.png   (1200×1800, PNG-24)
    preview.jpg           (1200×1800, JPG-85%)

/symbols/
  /{symbol_name}.svg      (ViewBox 24, Stroke 1.5px)
```

### Varianten-Suffixe
- `_standard` (Modern Mystic Tech)
- `_retro_cyborg` (Retro-Cyborg Pack)  
- `_organic` (Organic Watercolor)

---

## ✅ Design-Deliverables Checkliste

### Phase 1: Konzept & Prototyp
- [ ] Stil-Exploration für 3 Varianten
- [ ] 3 Beispiel-Karten (Navigator/Zweifler) in allen Varianten
- [ ] Layer-Separation Test
- [ ] Flip-Animation Mockup

### Phase 2: Vollständiges Set
- [ ] 12 Haupt-Archetypen (Primär/Schatten-Paare)
- [ ] 5 Sonder-Archetypen  
- [ ] Alle Layer separat exportiert
- [ ] Symbol-SVG-Bibliothek
- [ ] Design-System Dokumentation

### Phase 3: Internationalisierung
- [ ] Deutsche Textintegration
- [ ] Englische Textintegration
- [ ] Responsive Layouts getestet
- [ ] Accessibility Review

---

## 🔧 Technische Constraints

### Performance-Budget
- **Erstes Rendering:** <350kB (gzipped)
- **Lazy Loading:** Back-Layer nur bei Flip
- **Symbol-SVGs:** <8kB pro Datei

### Browser-Kompatibilität  
- **iOS:** 16+
- **Android:** 11+
- **Desktop:** Letzte 2 Versionen (Chrome, Firefox, Safari, Edge)

### Accessibility
- **Kontrast:** WCAG AA (4.5:1)
- **Fokus-Ringe:** Für Keyboard-Navigation
- **Screen Reader:** Alt-Texte für alle visuellen Elemente

---

## 🤝 Collaboration & Feedback

### Design-Reviews
- **Milestone 1:** Stil-Konzepte (3 Varianten)
- **Milestone 2:** Erstes vollständiges Kartenpaar  
- **Milestone 3:** Vollständiges Set (5 Karten)
- **Final Review:** Technische QA vor Development

### Communication
- **Updates:** Wöchentlich via [Kanal]
- **Assets:** Über [CDN/Cloud-Storage]
- **Feedback:** [Issue-Tracker/Tool]

---

**Nächste Schritte:** Bitte erst Stil-Exploration für "Modern Mystic Tech" + "Retro-Cyborg" erstellen, bevor Full Production startet.
