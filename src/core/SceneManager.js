import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Loop } from './Loop.js';
import { Resizer } from './Resizer.js';

class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x020205);
    this.renderer.shadowMap.enabled = false;

    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
    this.camera.position.set(0, 10, 28);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020205, 0.012);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.maxDistance = 80;
    this.controls.minDistance = 5;
    this.controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xfff5e1, 0x080808, 0.8);
    this.scene.add(hemisphereLight);

    this.loop = new Loop({ renderer: this.renderer, scene: this.scene, camera: this.camera });
    this.loop.add({ update: () => this.controls.update() });

    this.resizer = new Resizer({ camera: this.camera, renderer: this.renderer, container: this.canvas.parentElement || document.body });
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  dispose() {
    this.stop();
    this.resizer.dispose();
    this.controls.dispose();
    this.renderer.dispose();
  }
}

export { SceneManager };
