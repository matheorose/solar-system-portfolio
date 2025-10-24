import * as THREE from 'three';
import { Sun } from './Sun.js';
import { Planet } from './Planet.js';
import { Orbit } from './Orbit.js';
import { Starfield } from './Starfield.js';
import projects from '../data/projects.json';

class SolarSystem extends THREE.Group {
  constructor() {
    super();

    this.sun = new Sun({ radius: 3 });
    this.add(this.sun);

    this.starfield = new Starfield({ count: 1200, radius: 160 });
    this.add(this.starfield);

    this.planets = [];
    this.orbits = [];
    this.pivots = [];
    this.isPaused = false;

    projects.forEach((config, index) => {
      const pivot = new THREE.Object3D();
      const orbitSpeed = config.orbitSpeed || 0.2 + index * 0.05;
      pivot.userData = { speed: orbitSpeed };

      const screenOrbitSpeed = (config.screenOrbitSpeed ?? orbitSpeed * 3) * 1.1 ** index;

      const planet = new Planet({ ...config, screenOrbitSpeed });
      planet.position.set(config.orbitRadius, 0, 0);
      planet.userData.orbitRadius = config.orbitRadius;
      planet.userData.orbitSpeed = pivot.userData.speed;
      this.planets.push(planet);
      pivot.add(planet);

      if (config.hasRing) {
        const ringGeometry = new THREE.RingGeometry(config.radius * 1.1, config.radius * 1.8, 48);
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: config.ringColor || '#d9c589',
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
      }

      const orbit = new Orbit({ radius: config.orbitRadius, color: config.orbitColor });
      this.orbits.push(orbit);
      this.add(orbit);

      this.pivots.push(pivot);
      this.add(pivot);
    });

    this.selectables = [this.sun, ...this.planets];
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  update(delta) {
    if (this.isPaused) {
      return;
    }

    this.pivots.forEach(pivot => {
      const speed = pivot.userData.speed;
      pivot.rotation.y += delta * speed;
    });

    this.planets.forEach(planet => {
      const screenPivot = planet.screenPivot;
      if (!screenPivot) {
        return;
      }

      const speed = screenPivot.userData.speed;
      screenPivot.rotation.y -= delta * speed;
    });
  }
}

export { SolarSystem };
