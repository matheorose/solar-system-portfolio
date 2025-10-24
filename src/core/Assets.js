import * as THREE from 'three';

class Assets {
  constructor() {
    this.manager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.gltfLoader = null; // lazily imported when needed
    this.cache = new Map();
  }

  loadTexture(path) {
    if (this.cache.has(path)) {
      return Promise.resolve(this.cache.get(path));
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        texture => {
          this.cache.set(path, texture);
          resolve(texture);
        },
        undefined,
        error => reject(error)
      );
    });
  }

  async loadGLTF(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone(true);
    }

    if (!this.gltfLoader) {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      this.gltfLoader = new GLTFLoader(this.manager);
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        gltf => {
          this.cache.set(path, gltf);
          resolve(gltf);
        },
        undefined,
        error => reject(error)
      );
    });
  }
}

export const assets = new Assets();
