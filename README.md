

---

## 🔩 AutoScrew – Learning to Autonomously Screw

## 🎥 YouTube Video:
[![Watch the video](https://img.youtube.com/vi/WrsYrJQtBNE/0.jpg)](https://youtu.be/WrsYrJQtBNE)

**AutoScrew** ist ein webbasiertes 3D-System in JavaScript und adneren Techologien zur Automatisierung von Schraubvorgängen in der robotergestützten Montage. Durch die Analyse von 3D-Meshes und interaktive Visualisierung erkennt das System automatisch kreisförmige Strukturen (z. B. Schraublöcher) in importierten CAD-Modellen, bestimmt deren Geometrie und unterstützt die autonome Bewegungsplanung eines Roboters. Die gesamte Anwendung wurde vollständig in JavaScript, React und Three.js umgesetzt.

![image](https://github.com/user-attachments/assets/e0fd7a1e-f702-49aa-bed0-3ab5fd4d753e)

---

### 🚀 Projektüberblick

- 🧠 **Ziel:** Automatisierung von Schraubvorgängen durch Analyse von CAD-Modellen (3MF, OBJ, GLB)
- 🔎 **Funktion:** Erkennung kreisförmiger Geometrien als Bohrlöcher mittels Kantenfilterung und Gruppierung
- 🛠️ **Technologie:** JavaScript + React + @react-three/fiber + three.js + WebSocket + real-time UI
- 🤖 **Anwendung:** Autonome Roboterprogrammierung durch Interaktion mit erkannter Geometrie
- 📊 **Paper:** [AutoScrew: Learning to Autonomously Screw (PDF)](./16_AutoScrew_Learning_to_Autonomously_Screw.pdf)

---

### 🧠 Technischer Hintergrund (Paper)

> „… The identified screw holes are translated into target frames … enabling the robotic arm to automatically grasp screws and fasten them …“ – (*AutoScrew Paper*, Abstract)

- **Kreisdetektion:** Basierend auf Edge-Geometrie-Analyse, siehe [Figure 2 in paper, page 2]
- **Gruppierung & Validierung:** Gruppierung geschlossener Schleifen (closed loops) → Bewertung ihrer Circularity
- **Normalenberechnung:** Verwendung von Vektor-Kreuzprodukten zur Bestimmung der Einfügerichtung der Schraube

![image](https://github.com/user-attachments/assets/ae057bff-2593-4dd4-8b1f-70a6fa618fe6)


---

### 🧩 Architektur & Komponenten

```bash
/src
├── AutoScrew.js           # Haupt-Scene-Komponente: lädt Modelle, erkennt Kreise
├── InteractiveLine.js     # Hervorhebung erkannter Kreise (hover/click)
├── InteractiveSphere.js   # Interaktive Zentren der Kreise (clickable)
├── brainwave.js           # Kreis-Erkennung, Gruppierung, Normalen-Berechnung
├── utils/threeUtils.js    # Mathematische Geometrie-Utilities
```

---

### 🎯 Kernfunktionalitäten

- **Mesh-Laden**: Unterstützung für OBJ/3MF/GLB Modelle mit `ThreeMFLoader`, `OBJLoader`
- **Kantenerkennung**: Extrahieren von `EdgesGeometry` und Filtern durch geometrische Schwellen
- **Kreisgruppierung**: Clustering von Segmenten zu geschlossenen Loops (siehe `groupCircularEdges`)
- **Normalenberechnung**: Ermittlung der Einschraubrichtung für Roboterarmsimulationen
- **UI-Komponenten**: Reaktive Komponenten mit Click-Interaktion (`InteractiveLine`, `InteractiveSphere`)

![image](https://github.com/user-attachments/assets/3b045c28-48ab-43ca-8265-639a1485f802)

---

### 📸 Demo (Visualisierung)

> 🎯 Klicken auf Kreise oder Linien zeigt Kreisparameter in der Konsole  
> 💡 Interaktive Komponenten zur Validierung und Planung mit Robotern

![GIF/Demo Screenshot Placeholder](https://your-image-link-if-available.com)

---

### 💡 Gelernte Fähigkeiten

- 🧠 Geometrie-Verarbeitung mit Three.js (Meshes, EdgesGeometry, BufferGeometry)
- 🎛️ Umsetzung interaktiver WebGL-Komponenten mit @react-three/fiber
- 🧩 Analyse und Gruppierung geometrischer Features aus 3D-Modellen
- ⚙️ Eigenständige Entwicklung von Kreisdetektionsalgorithmen
- 👨‍💻 Umsetzung komplexer Logik mit sauber strukturiertem React-Frontend

---

### 📄 Publikation

📘 **AutoScrew: Learning to Autonomously Screw**  
[Link zum Paper ansehen](./16_AutoScrew_Learning_to_Autonomously_Screw.pdf)

---
