# Portfolio 3D – État du projet

Ce dépôt contient la base du portfolio 3D réalisée avec Vite, Three.js et GSAP. Cette première itération met en place la structure logicielle, l’environnement de rendu et un système solaire interactif minimal.

## Architecture du code

L’application suit l’arborescence décrite dans le cahier des charges :

- `src/core/` : infrastructure Three.js (gestion de scène/caméra, boucle d’animation, resize, entrées, chargement d’assets et bus d’événements).
- `src/world/` : éléments 3D du système solaire (Soleil, planètes, orbits, starfield, assembleur `SolarSystem`).
- `src/data/` : configuration JSON des planètes/projets (`projects.json`).
- `src/ui/` : overlay HTML/CSS/JS pour les fiches projet (structure prête mais désactivée par défaut).
- `src/utils/` : utilitaires génériques (palette de couleurs, helpers maths).
- `src/main.js` : bootstrap Vite → création du `SceneManager`, instanciation du système solaire, animation caméra via GSAP.

## Fonctionnalités livrées

1. **Stack Vite/Three/GSAP configurée** : scripts npm (`dev`, `build`, `preview`), config Vite dédiée (`vite.config.js`) et initialisation du canvas via `index.html`.
2. **Gestion de scène centralisée** : `SceneManager` prépare le renderer (antialias, colorimétrie), la caméra, les lumières, les `OrbitControls` (orbite/zoom autorisés) et la boucle `Loop` synchronisée sur `requestAnimationFrame`.
3. **Système solaire dynamique** :
   - Soleil emissif + lumière ponctuelle centrale (`Sun`).
   - Planètes paramétrables chargées depuis `projects.json` (rayon, couleur, vitesse d’orbite, anneaux optionnels) avec rotation propre (`Planet`).
   - Orbites visuelles (`Orbit`) et starfield procédural (`Starfield`).
   - Mise à jour continue de la rotation orbitale via pivots dans `SolarSystem.update`.
4. **Transition caméra initiale** : GSAP anime l’entrée de la caméra pour dévoiler la scène; `OrbitControls` restent actifs pour pivoter et zoomer.
5. **Overlay UI prêt** : l’overlay DOM est instancié et masqué par défaut (`Overlay`), prêt à être alimenté lors des prochaines itérations (raycasting + fiche projet).
6. **Styles globaux** : reset minimal, plein écran pour le canvas, base pour l’overlay.

## Instructions de développement

```bash
npm install
npm run dev    # serveur de développement Vite
npm run build  # build de production (déjà vérifié)
npm run preview
```

Le build actuel génère un warning de taille (>500 kB) dû à Three.js/GSAP minifiés ; il est attendu pour cette étape.

## Étapes suivantes suggérées

- Ajouter l’interactivité planète ↔ overlay (raycaster, gestion d’événements, GSAP pour transitions UI).
- Mettre en place les effets de post-processing prévus (Bloom, FXAA, etc.) via `EffectComposer`.
- Enrichir `projects.json` et relier chaque planète à son contenu (liens, description, tags).
