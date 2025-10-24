import * as THREE from 'three';

class Loop {
  constructor({ renderer, scene, camera }) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.clock = new THREE.Clock();
    this.updatables = new Set();
  }

  add(object) {
    if (object && typeof object.update === 'function') {
      this.updatables.add(object);
    }
  }

  remove(object) {
    this.updatables.delete(object);
  }

  start() {
    this.renderer.setAnimationLoop(this.tick);
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick = () => {
    const delta = this.clock.getDelta();
    const elapsed = this.clock.elapsedTime;

    this.updatables.forEach(obj => obj.update(delta, elapsed));
    this.renderer.render(this.scene, this.camera);
  };
}

export { Loop };
