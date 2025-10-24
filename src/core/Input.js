import * as THREE from 'three';

class Input {
  constructor({ camera, domElement }) {
    this.camera = camera;
    this.domElement = domElement;
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.domElement.addEventListener('pointermove', this.updatePointer);
    this.domElement.addEventListener('pointerdown', this.updatePointer);
  }

  dispose() {
    this.domElement.removeEventListener('pointermove', this.updatePointer);
    this.domElement.removeEventListener('pointerdown', this.updatePointer);
  }

  updatePointer = event => {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  cast(objects) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects(objects, true);
  }
}

export { Input };
