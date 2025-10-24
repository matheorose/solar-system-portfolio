class Resizer {
  constructor({ camera, renderer, container }) {
    this.camera = camera;
    this.renderer = renderer;
    this.container = container;

    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  onResize = () => {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  dispose() {
    window.removeEventListener('resize', this.onResize);
  }
}

export { Resizer };
