// Gallery.js: Dynamic gallery for homepage
// Usage: import { Gallery } from './components/Gallery.js';
//   const gallery = new Gallery('#gallery', '/assets/publications.json');
//   gallery.init();

export class Gallery {
  constructor(containerSelector, jsonPath) {
    this.container = document.querySelector(containerSelector);
    this.jsonPath = jsonPath;
    this.allItems = [];
    this.filteredItems = [];
    this.currentFilter = 'All';
  }

  async init() {
    if (!this.container) return;
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (!data.items || !Array.isArray(data.items)) throw new Error('Invalid data format');
      // Sort by date descending
      this.allItems = [...data.items].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      this.filteredItems = this.allItems;
    } catch (err) {
      this.container.innerHTML = '<p class="error">Failed to load gallery data.</p>';
    }
  }

  setFilter(category) {
    this.currentFilter = category;
    if (category === 'All') {
      this.filteredItems = this.allItems;
    } else {
      // Map UI label to data category
      const map = {
        'Articles': 'references',
        'Case studies': 'references',
        'Notebooks': 'notebooks',
        'Projects': 'projects',
        'Resources': 'resources',
      };
      if (category === 'Articles') {
        this.filteredItems = this.allItems.filter(i => i.category === 'references' && i.src && i.src.includes('/articles/'));
      } else if (category === 'Case studies') {
        this.filteredItems = this.allItems.filter(i => i.category === 'references' && i.src && i.src.includes('/case-studies/'));
      } else {
        this.filteredItems = this.allItems.filter(i => i.category === map[category]);
      }
    }
  }

  renderItems(items, { append = false } = {}) {
    if (!Array.isArray(items)) return;
    if (!append) this.container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    let baseDelay = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.setAttribute('data-category', item.category || '');
      div.setAttribute('data-date', item.date || '');
      div.setAttribute('data-id', item.id || '');
      div.innerHTML = `
        <a href="${item.link || '#'}">
          <div class="gallery-image-wrapper">
            <img src="${item.thumbnail || ''}" alt="${item.title || ''}">
          </div>
        </a>
        <p class="gallery-title">${item.title || ''}</p>
      `;
      fragment.appendChild(div);
      // Staggered fade-in
      setTimeout(() => {
        div.classList.add('visible');
      }, baseDelay + i * 80);
    }
    this.container.appendChild(fragment);
  }
}
