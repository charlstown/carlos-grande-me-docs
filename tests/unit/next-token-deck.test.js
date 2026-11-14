import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { afterEach, describe, expect, it } from 'vitest';

const html = readFileSync('docs/assets/decks/next-token-prediction.html', 'utf8');
const fragment = html.split('<!--8<-- [start:diagram]-->')[1].split('<!--8<-- [end:diagram]-->')[0];
let dom;

function mount(count = 1, setup = () => {}) {
  dom = new JSDOM(`<!doctype html><html><body><main id="outside"></main>${fragment.repeat(count)}</body></html>`, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: false });
      setup(window);
    },
  });
  return dom.window.document;
}

afterEach(async () => {
  if (!dom) return;
  dom.window.document.querySelectorAll('.nt-deck').forEach(deck => deck.remove());
  await Promise.resolve();
  dom.window.close();
});

describe('next-token deck integration', () => {
  it('isolates SVG marker references across instances', () => {
    const document = mount(2);
    const decks = [...document.querySelectorAll('.nt-deck')];
    const markers = decks.map(deck => deck.querySelector('marker').id);
    expect(new Set(markers).size).toBe(2);
    decks.forEach((deck, index) => {
      expect(deck.querySelector('.nt-segment').getAttribute('marker-end')).toBe(`url(#${markers[index]})`);
    });
  });

  it('restores page state when an expanded deck is removed', async () => {
    const document = mount();
    const outside = document.querySelector('#outside');
    document.body.style.overflow = 'scroll';
    const deck = document.querySelector('.nt-deck');
    deck.querySelector('.nt-expand').click();
    expect(document.body.style.overflow).toBe('hidden');
    expect(outside.hasAttribute('inert')).toBe(true);
    deck.remove();
    await Promise.resolve();
    expect(document.body.style.overflow).toBe('scroll');
    expect(outside.hasAttribute('inert')).toBe(false);
  });

  it('captures output elements even if the next click precedes the drawing frame', () => {
    const animations = [];
    const document = mount(1, window => {
      Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', { get: () => 520 });
      Object.defineProperty(window.HTMLElement.prototype, 'clientHeight', { get: () => 400 });
      window.requestAnimationFrame = () => 1;
      window.cancelAnimationFrame = () => {};
      window.Element.prototype.animate = function () {
        animations.push(this);
        return { cancel() {}, finished: new Promise(() => {}) };
      };
      window.Element.prototype.getBoundingClientRect = function () {
        if (this.classList.contains('nt-network')) return { left: 0, top: 0, width: 520, height: 400 };
        if (this.classList.contains('nt-neuron')) {
          const index = [...this.parentElement.querySelectorAll('.nt-neuron')].indexOf(this);
          return { left: 160, top: 150 + index * 30, width: 12, height: 12 };
        }
        return { left: 20, top: 20, width: 20, height: 20 };
      };
    });
    document.querySelectorAll('.nt-phase-button')[3].click();
    document.querySelector('.nt-next').click();
    expect(document.querySelector('.nt-progress-count').textContent).toBe('5 / 7');
    expect(animations).toHaveLength(12);
  });

  it('finishes active animations when reduced motion is enabled', async () => {
    const listeners = new Set();
    const frames = [];
    const cancelled = [];
    const motion = {
      matches: false,
      addEventListener(type, listener) { if (type === 'change') listeners.add(listener); },
      removeEventListener(type, listener) { if (type === 'change') listeners.delete(listener); },
      change(matches) { this.matches = matches; listeners.forEach(listener => listener({ matches })); },
    };
    const document = mount(1, window => {
      window.matchMedia = query => query.includes('prefers-reduced-motion') ? motion : { matches: false };
      window.requestAnimationFrame = callback => { frames.push(callback); return frames.length; };
      window.cancelAnimationFrame = () => {};
      window.Element.prototype.getBoundingClientRect = () => ({ left: 20, top: 20, width: 20, height: 20 });
      window.Element.prototype.animate = function () {
        return { cancel() { cancelled.push(true); }, finished: new Promise(() => {}) };
      };
    });
    const buttons = document.querySelectorAll('.nt-phase-button');
    buttons[4].click();
    frames.shift()(dom.window.performance.now() + 1100);
    const percent = document.querySelector('.nt-prob-percent');
    expect(percent.textContent).not.toBe('1,4 %');
    motion.change(true);
    expect(percent.textContent).toBe('1,4 %');
    expect(document.querySelector('.nt-prob-fill').style.transform).toBe('');

    motion.change(false);
    buttons[2].click();
    buttons[3].click();
    const target = document.querySelector('[data-transpose]');
    expect(target.style.visibility).toBe('hidden');
    motion.change(true);
    expect(target.style.visibility).toBe('');
    expect(cancelled.length).toBeGreaterThan(0);

    motion.change(false);
    buttons[5].click();
    expect(document.querySelector('.nt-result-answer').textContent).toBe('?');
    motion.change(true);
    expect(document.querySelector('.nt-result-answer').textContent).toBe('perro');
    document.querySelector('.nt-deck').remove();
    await Promise.resolve();
    expect(listeners.size).toBe(0);
  });

  it('slows the percentage count and keeps it synchronized with the bars', () => {
    const frames = [];
    const document = mount(1, window => {
      Object.defineProperty(window.performance, 'now', { value: () => 0 });
      window.requestAnimationFrame = callback => { frames.push(callback); return frames.length; };
      window.cancelAnimationFrame = () => {};
    });
    document.querySelectorAll('.nt-phase-button')[4].click();
    const percent = document.querySelectorAll('.nt-prob-percent')[3];
    const fill = document.querySelectorAll('.nt-prob-fill')[3];
    frames.shift()(1600);
    expect(percent.textContent).toBe('36,4 %');
    expect(Number(fill.style.transform.match(/scaleX\((.*)\)/)[1])).toBeCloseTo(Math.SQRT1_2);
    frames.shift()(2080);
    expect(percent.textContent).toBe('48,9 %');
    frames.shift()(2400);
    expect(percent.textContent).toBe('51,5 %');
    expect(fill.style.transform).toBe('scaleX(1)');
  });
});
