// Gallery.js: Dynamic gallery for homepage
// Usage: import { Gallery } from './components/Gallery.js';
//   const gallery = new Gallery('#gallery', '/assets/publications.json');
//   gallery.init();

export class Gallery {
  constructor(containerSelector, jsonPath) {
    this.container = document.querySelector(containerSelector);
    this.jsonPath = jsonPath;
    this.allItems = [];
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
      this.renderItems(this.allItems);
    } catch (err) {
      this.container.innerHTML = '<p class="error">Failed to load gallery data.</p>';
    }
  }

  setFilter(category) {
    this.currentFilter = category;
    let filtered;
    if (category === 'All') {
      filtered = this.allItems;
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
        filtered = this.allItems.filter(i => i.category === 'references' && i.src && i.src.includes('/articles/'));
      } else if (category === 'Case studies') {
        filtered = this.allItems.filter(i => i.category === 'references' && i.src && i.src.includes('/case-studies/'));
      } else {
        filtered = this.allItems.filter(i => i.category === map[category]);
      }
    }
    this.renderItems(filtered);
  }

  renderItems(items) {
    if (!Array.isArray(items)) return;
    // Fade out
    this.container.style.opacity = 0.3;
    setTimeout(() => {
      const html = items.map(item => `
        <div class="gallery-item" data-category="${item.category || ''}" data-date="${item.date || ''}" data-id="${item.id || ''}">
          <a href="${item.link || '#'}">
            <div class="gallery-image-wrapper">
              <img src="${item.thumbnail || ''}" alt="${item.title || ''}">
            </div>
          </a>
          <p class="gallery-title">${item.title || ''}</p>
        </div>
      `).join('');
      this.container.innerHTML = html;
      // Fade in
      this.container.style.transition = 'opacity 0.25s';
      this.container.style.opacity = 1;
    }, 120);
  }
}
