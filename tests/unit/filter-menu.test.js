import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FilterMenu } from '../../docs/assets/javascripts/components/FilterMenu.js';

const CATEGORIES = ['All', 'Projects', 'Notebooks'];

function buttonByText(text) {
  return [...document.querySelectorAll('button.filter-btn')].find(
    b => b.textContent.replace(/\s+/g, '').startsWith(text)
  );
}

beforeEach(() => {
  document.body.innerHTML = '<div id="filterMenu"></div>';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('FilterMenu render', () => {
  it('creates one button.filter-btn per category and marks the first (All) active', () => {
    new FilterMenu('#filterMenu', CATEGORIES, () => {});
    const buttons = document.querySelectorAll('button.filter-btn');
    expect(buttons).toHaveLength(3);
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[1].classList.contains('active')).toBe(false);
    expect(buttons[2].classList.contains('active')).toBe(false);
  });
});

describe('FilterMenu.setActive', () => {
  it('moves the active class to the targeted button and removes it from All', () => {
    const menu = new FilterMenu('#filterMenu', CATEGORIES, () => {});
    menu.setActive('Projects');
    expect(buttonByText('All').classList.contains('active')).toBe(false);
    expect(buttonByText('Projects').classList.contains('active')).toBe(true);
  });

  it('invokes the onChange callback once with the new category', () => {
    const onChange = vi.fn();
    const menu = new FilterMenu('#filterMenu', CATEGORIES, onChange);
    menu.setActive('Projects');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('Projects');
  });
});

describe('FilterMenu click', () => {
  it('clicking a button triggers setActive and fires onChange with that category', () => {
    const onChange = vi.fn();
    const menu = new FilterMenu('#filterMenu', CATEGORIES, onChange);
    const spy = vi.spyOn(menu, 'setActive');

    buttonByText('Notebooks').click();

    expect(spy).toHaveBeenCalledWith('Notebooks');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('Notebooks');
  });
});

describe('FilterMenu.setCounts', () => {
  it('re-renders with sup.filter-count text matching the provided counts', () => {
    const menu = new FilterMenu('#filterMenu', CATEGORIES, () => {});
    menu.setCounts({ All: 5, Projects: 2 });

    const allSup = buttonByText('All').querySelector('sup.filter-count');
    const projectsSup = buttonByText('Projects').querySelector('sup.filter-count');
    expect(allSup).not.toBeNull();
    expect(allSup.textContent).toBe('5');
    expect(projectsSup).not.toBeNull();
    expect(projectsSup.textContent).toBe('2');
  });

  it('renders no sup.filter-count for a non-All category with count 0', () => {
    const menu = new FilterMenu('#filterMenu', CATEGORIES, () => {});
    menu.setCounts({ All: 5, Projects: 2 });
    const notebooksSup = buttonByText('Notebooks').querySelector('sup.filter-count');
    expect(notebooksSup).toBeNull();
  });
});

describe('FilterMenu.setActiveSilent', () => {
  it('moves the active class to the targeted button and removes it from All', () => {
    const menu = new FilterMenu('#filterMenu', CATEGORIES, () => {});
    menu.setActiveSilent('Projects');
    expect(buttonByText('All').classList.contains('active')).toBe(false);
    expect(buttonByText('Projects').classList.contains('active')).toBe(true);
  });

  it('does not invoke the onChange callback', () => {
    const onChange = vi.fn();
    const menu = new FilterMenu('#filterMenu', CATEGORIES, onChange);
    menu.setActiveSilent('Projects');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not change the active button or throw for a category not in categories', () => {
    const onChange = vi.fn();
    const menu = new FilterMenu('#filterMenu', CATEGORIES, onChange);
    expect(() => menu.setActiveSilent('Unknown')).not.toThrow();
    expect(buttonByText('All').classList.contains('active')).toBe(true);
    expect(buttonByText('Projects').classList.contains('active')).toBe(false);
    expect(buttonByText('Notebooks').classList.contains('active')).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});
