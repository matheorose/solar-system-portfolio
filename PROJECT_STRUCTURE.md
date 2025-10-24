# Structure du projet Portfolio 3D

## Racine du dépôt
- `index.html` : point d'entrée HTML fourni par Vite, monte le canvas WebGL (`#webgl`) et l'ancre DOM pour l'overlay (`#overlay-root`).
- `src/` : code applicatif (Three.js, logique système solaire, UI, utilitaires).
- `dist/` : sortie de build Vite (générée par `npm run build`).
- `node_modules/` : dépendances npm installées localement.
- `package.json` / `package-lock.json` : métadonnées du projet, scripts (`dev`, `build`, `preview`) et dépendances (`three`, `gsap`, `vite`).
- `vite.config.js` : configuration Vite (SPA, build vers `dist`, sourcemaps activés).
- `README.md` : état du projet et instructions d'exécution.
- `Instruction.md` : cahier des charges initial décrivant l'architecture attendue et les fonctionnalités à implémenter.

## `src/`
### Fichiers racine
- `src/main.js` : bootstrap. Instancie `SceneManager`, crée le `SolarSystem`, configure GSAP pour les transitions caméra, initialise les contrôles d'orbite et la logique de focus sur un astre via raycasting/inputs.
- `src/styles.css` : reset global, styles pour le canvas plein écran, le conteneur overlay et le bouton de réinitialisation de focus.

### `src/core/` – infrastructure Three.js
- `Assets.js` : gestionnaire de ressources. Charge et met en cache textures (TextureLoader) et GLTF (GLTFLoader lazy-loaded).
- `Events.js` : wrapper minimal autour de `EventTarget` pour publier/écouter des événements applicatifs.
- `Input.js` : centralise le raycaster (pointer → coordonnées normalisées) et expose `cast()` pour récupérer les intersections avec des objets sélectionnables.
- `Loop.js` : boucle d'animation basée sur `THREE.Clock`. Appelle `update(delta, elapsed)` sur les objets enregistrés et déclenche le rendu.
- `Resizer.js` : écoute `resize`, ajuste ratio de la caméra et résolution du renderer avec clamping du pixel ratio.
- `SceneManager.js` : assemble renderer, caméra, scène, lumières d'ambiance/contre-jour, `OrbitControls`, boucle `Loop` et `Resizer`. Fournit `start/stop/dispose`.

### `src/world/` – éléments 3D
- `Orbit.js` : anneau plat représentant la trajectoire orbitale (géométrie `RingGeometry`, orientée dans le plan XZ).
- `Planet.js` : groupe planète. Crée la sphère texturée, la pivote, ajoute un écran flottant (mesh plan) qui reste tangent à la surface grâce à la normale locale recalculée chaque frame, et fait tourner l'écran via un pivot.
- `SolarSystem.js` : assemble la scène cosmique. Génère le Soleil, le starfield, boucle sur `projects.json` pour créer pivots, planètes, anneaux facultatifs, orbits visuelles et sélectionnables. Met à jour les pivots d'orbite tant que le système n'est pas en pause.
- `Starfield.js` : génère un nuage de points pseudo-aléatoires répartis sur une sphère (densité biaisée) pour simuler un fond d'étoiles.
- `Sun.js` : groupe représentant l'astre central (maillage emissif, halo additif et `PointLight` avec ombres).

### `src/data/`
- `projects.json` : configuration des planètes/projets (nom, rayon, couleurs diffuse/emissive, rayon/vitesse d'orbite, anneau optionnel).

### `src/ui/`
- `overlay.js` : composant Overlay basé DOM. Injecte un template HTML, expose `show()` / `hide()` pour afficher le contenu de projet (titre, description, lien) et gère la fermeture.
- `overlay.css` : styles de l'overlay (panneau translucide, bouton de fermeture, typographie).
- `overlay.html` : markup statique équivalent au template injecté par `overlay.js` (utilisé comme référence/documentation UI).

### `src/utils/`
- `colors.js` : palette centrale utilisée pour harmoniser les teintes.
- `math.js` : helpers numériques courants (`clamp`, `lerp`, conversions rad↔deg, tirage aléatoire borné).

## Autres éléments
- `dist/` : contiendra les bundles/actifs optimisés après build (non suivi en détail ici car généré).
- `node_modules/` : dépendances externes. À ne pas modifier directement.

Pour explorer ou étendre le projet, démarrer le serveur Vite (`npm run dev`) afin de visualiser la scène et tester les interactions caméra/focus.
