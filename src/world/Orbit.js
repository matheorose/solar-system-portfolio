import * as THREE from 'three';

class Orbit extends THREE.Mesh {
  constructor({ radius, color = 0x4b4b4b }) {
    const geometry = new THREE.RingGeometry(radius - 0.03, radius + 0.03, 128);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    super(geometry, material);

    this.rotation.x = Math.PI / 2;
  }
}

export { Orbit };
