import * as THREE from 'three';

const directionVector = new THREE.Vector3();
const planetCenterWorld = new THREE.Vector3();
const screenWorld = new THREE.Vector3();
const defaultScreenNormal = new THREE.Vector3(0, 0, 1);
const quaternion = new THREE.Quaternion();

const createFloatingScreen = (radius, orbitSpeed) => {
  const pivot = new THREE.Object3D();
  pivot.position.set(0, 0, 0);
  pivot.userData = {
    speed: Math.max(orbitSpeed ?? 0.8, 0.05)
  };
  pivot.rotation.y = Math.random() * Math.PI * 2;

  const screenWidth = Math.max(radius * 0.6, 0.4);
  const screenHeight = Math.max(radius * 0.4, 0.26);
  const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x090909,
    metalness: 0.2,
    roughness: 0.4,
    side: THREE.DoubleSide
  });

  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  const orbitRadius = radius * 1.2;

  screen.position.set(orbitRadius, 0, 0);

  screen.userData = {
    size: {
      width: screenWidth,
      height: screenHeight
    }
  };

  const alignQ = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 0) 
  );
  screen.quaternion.copy(alignQ);

  screen.castShadow = true;
  screen.receiveShadow = true;

  pivot.add(screen);
  pivot.userData.screen = screen;

  return pivot;
};

class Planet extends THREE.Group {
  constructor({ name, radius = 1, color = '#ffffff', emissive = '#000000', screenOrbitSpeed } = {}) {
    super();
    this.userData.rotationSpeed = (0.3 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1);

    this.name = name;
    this.userData.isPlanet = true;
    this.userData.name = name;
    this.userData.radius = radius;

    const geometry = new THREE.SphereGeometry(radius, 48, 48);
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive,
      roughness: 0.6,
      metalness: 0.1
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);

    this.screenPivot = createFloatingScreen(radius, screenOrbitSpeed);
    this.add(this.screenPivot);
  }
}

export { Planet };
