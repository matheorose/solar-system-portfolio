const SELECTORS = {
  overlay: '[data-overlay]',
  close: '[data-overlay-close]',
  title: '[data-overlay-title]',
  description: '[data-overlay-description]',
  link: '[data-overlay-link]'
};

class Overlay {
  constructor(root) {
    if (!root) {
      throw new Error('Overlay root element is required');
    }

    root.innerHTML = '';
    this.root = root;
    this.root.insertAdjacentHTML('afterbegin', this.template());

    this.elements = {
      wrapper: this.root.querySelector(SELECTORS.overlay),
      close: this.root.querySelector(SELECTORS.close),
      title: this.root.querySelector(SELECTORS.title),
      description: this.root.querySelector(SELECTORS.description),
      link: this.root.querySelector(SELECTORS.link)
    };

    this.elements.close.addEventListener('click', () => this.hide());
  }

  template() {
    return `
      <div class="overlay" data-overlay>
        <button class="overlay__close" data-overlay-close>×</button>
        <div class="overlay__content" data-overlay-content>
          <h2 data-overlay-title>Projet</h2>
          <p data-overlay-description>Sélectionnez une planète pour découvrir le projet correspondant.</p>
          <a data-overlay-link href="#" target="_blank" rel="noopener">Voir le projet</a>
        </div>
      </div>
    `;
  }

  show({ title, description, link } = {}) {
    if (title) this.elements.title.textContent = title;
    if (description) this.elements.description.textContent = description;
    if (link) {
      this.elements.link.href = link;
      this.elements.link.style.display = 'inline-flex';
    } else {
      this.elements.link.style.display = 'none';
    }

    this.elements.wrapper.classList.add('is-active');
  }

  hide() {
    this.elements.wrapper.classList.remove('is-active');
  }
}

export { Overlay };
