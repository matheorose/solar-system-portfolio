class EventDispatcher {
  constructor() {
    this.target = document.createElement('span');
  }

  on(type, callback) {
    this.target.addEventListener(type, callback);
  }

  off(type, callback) {
    this.target.removeEventListener(type, callback);
  }

  emit(type, detail) {
    this.target.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

export const events = new EventDispatcher();
