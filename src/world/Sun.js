import * as THREE from 'three';

class Sun extends THREE.Group {
  constructor({ radius = 3 } = {}) {
    super();

    this.userData.isSun = true;
    this.userData.radius = radius;

    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffc857,
      emissive: 0xff8f1f,
      emissiveIntensity: 1.2,
      roughness: 0.3
    });

    const core = new THREE.Mesh(geometry, material);
    core.castShadow = false;
    core.receiveShadow = false;
    this.add(core);

    const glowGeometry = new THREE.SphereGeometry(radius * 1.4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd27f,
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.add(glow);

    const light = new THREE.PointLight(0xffc857, 3, 120, 2);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.0005;
    this.add(light);
  }
}

export { Sun };
