import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Gallery } from '../../docs/assets/javascripts/components/GalleryHome.js';

/**
 * Mounts the gallery container and returns the node.
 */
function mountContainer() {
  document.body.innerHTML = '<div id="gallery"></div>';
  return document.querySelector('#gallery');
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Gallery.init', () => {
  it('sorts data.items by date descending', async () => {
    mountContainer();
    const items = [
      { id: '1', date: '2024-01-01', category: 'projects', src: '/projects/a/' },
      { id: '2', date: '2025-06-15', category: 'projects', src: '/projects/b/' },
      { id: '3', date: '2024-12-31', category: 'projects', src: '/projects/c/' },
    ];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items }),
    });

    const gallery = new Gallery('#gallery', '/assets/publications.json');
    await gallery.init();

    expect(gallery.allItems[0].date >= gallery.allItems[1].date).toBe(true);
    expect(gallery.allItems[1].date >= gallery.allItems[2].date).toBe(true);
    expect(gallery.allItems[0].date).toBe('2025-06-15');
  });

  it('renders an error state when fetch responds with ok:false', async () => {
    const container = mountContainer();
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const gallery = new Gallery('#gallery', '/assets/publications.json');
    await gallery.init();

    expect(container.innerHTML).toContain('Failed to load gallery data.');
  });

  it('renders an error state when data is malformed (no items array)', async () => {
    const container = mountContainer();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const gallery = new Gallery('#gallery', '/assets/publications.json');
    await gallery.init();

    expect(container.innerHTML).toContain('Failed to load gallery data.');
  });
});

describe('Gallery.setFilter', () => {
  function buildGallery() {
    mountContainer();
    const gallery = new Gallery('#gallery', '/assets/publications.json');
    gallery.allItems = [
      { id: '1', date: '2025-01-01', category: 'projects', src: '/projects/a/' },
      { id: '2', date: '2025-01-02', category: 'references', src: '/references/articles/x/' },
      { id: '3', date: '2025-01-03', category: 'references', src: '/references/case-studies/y/' },
      { id: '4', date: '2025-01-04', category: 'notebooks', src: '/notebooks/z/' },
    ];
    gallery.filteredItems = gallery.allItems;
    return gallery;
  }

  it("setFilter('Projects') keeps only items with category 'projects'", () => {
    const gallery = buildGallery();
    gallery.setFilter('Projects');
    expect(gallery.filteredItems).toHaveLength(1);
    expect(gallery.filteredItems.every(i => i.category === 'projects')).toBe(true);
  });

  it("setFilter('Articles') keeps only references whose src includes /articles/", () => {
    const gallery = buildGallery();
    gallery.setFilter('Articles');
    expect(gallery.filteredItems).toHaveLength(1);
    expect(gallery.filteredItems[0].id).toBe('2');
    expect(
      gallery.filteredItems.every(i => i.category === 'references' && i.src.includes('/articles/'))
    ).toBe(true);
  });

  it("setFilter('All') restores filteredItems to allItems", () => {
    const gallery = buildGallery();
    gallery.setFilter('Projects');
    gallery.setFilter('All');
    expect(gallery.filteredItems).toBe(gallery.allItems);
    expect(gallery.filteredItems).toHaveLength(4);
  });
});

describe('Gallery.renderItems', () => {
  const items = [
    { id: 'a', date: '2025-01-01', category: 'projects', title: 'A', link: '/a', thumbnail: '/a.png' },
    { id: 'b', date: '2025-01-02', category: 'notebooks', title: 'B', link: '/b', thumbnail: '/b.png' },
  ];

  it('produces one .gallery-home-item per item with correct data attributes', () => {
    const container = mountContainer();
    const gallery = new Gallery('#gallery', '/assets/publications.json');
    gallery.renderItems(items);

    const nodes = container.querySelectorAll('.gallery-home-item');
    expect(nodes).toHaveLength(2);
    expect(nodes[0].getAttribute('data-category')).toBe('projects');
    expect(nodes[0].getAttribute('data-id')).toBe('a');
    expect(nodes[1].getAttribute('data-category')).toBe('notebooks');
    expect(nodes[1].getAttribute('data-id')).toBe('b');
  });

  it('with { append: true } does not clear existing children', () => {
    const container = mountContainer();
    const gallery = new Gallery('#gallery', '/assets/publications.json');
    gallery.renderItems(items);
    expect(container.querySelectorAll('.gallery-home-item')).toHaveLength(2);

    gallery.renderItems(items, { append: true });
    expect(container.querySelectorAll('.gallery-home-item')).toHaveLength(4);
  });
});
