import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LazyLoader } from '../../docs/assets/javascripts/components/LazyLoader.js';

let observerInstances;

/**
 * Stub IntersectionObserver: each instance records observe/disconnect calls
 * and exposes the registered callback so tests can fire it manually.
 */
class FakeIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    observerInstances.push(this);
  }
  trigger(isIntersecting) {
    this.callback([{ isIntersecting }]);
  }
}

function mountContainer() {
  document.body.innerHTML = '<div id="list"></div>';
  return document.querySelector('#list');
}

function makeItems(n) {
  return Array.from({ length: n }, (_, i) => ({ id: i }));
}

let rectSpy;

beforeEach(() => {
  observerInstances = [];
  global.IntersectionObserver = vi.fn((cb) => new FakeIntersectionObserver(cb));
  // loadNext() keeps loading batches while the sentinel sits within
  // (innerHeight + 100). Push the sentinel well below the fold (large top) so
  // the loop renders exactly one batch per call.
  window.innerHeight = 800;
  rectSpy = vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockReturnValue({ top: 5000, bottom: 5000, left: 0, right: 0, width: 0, height: 0 });
  mountContainer();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  delete global.IntersectionObserver;
});

describe('LazyLoader.init', () => {
  it('creates a sentinel sibling, observes it, renders the first batch, and marks done when all items fit', () => {
    const container = document.querySelector('#list');
    const renderFn = vi.fn();
    const loader = new LazyLoader({ container, items: makeItems(5), renderFn, batchSize: 8 });

    loader.init();

    // init() constructs an IntersectionObserver and observes the sentinel it
    // created as the container's sibling before loading the first batch.
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);
    expect(observerInstances).toHaveLength(1);
    expect(observerInstances[0].observe).toHaveBeenCalledTimes(1);
    const observedNode = observerInstances[0].observe.mock.calls[0][0];
    expect(observedNode.tagName).toBe('DIV');
    // First batch rendered; all 5 items fit one batch of 8, so loader is done
    // and destroy() has already torn the sentinel back down.
    expect(renderFn).toHaveBeenCalled();
    expect(loader.done).toBe(true);
    expect(loader._sentinel).toBeNull();
  });

  it('renders the first 8 of 20, then loads the next 8 when the observer fires', () => {
    const container = document.querySelector('#list');
    const renderFn = vi.fn();
    const loader = new LazyLoader({ container, items: makeItems(20), renderFn, batchSize: 8 });

    loader.init();
    // After the first init() loadNext, only one batch should have rendered.
    expect(loader.offset).toBe(8);
    expect(loader.done).toBe(false);

    observerInstances[0].trigger(true);
    expect(loader.offset).toBe(16);
  });
});

describe('LazyLoader.loadNext guards', () => {
  it('does not call renderFn again once done is true', () => {
    const container = document.querySelector('#list');
    const renderFn = vi.fn();
    const loader = new LazyLoader({ container, items: makeItems(5), renderFn, batchSize: 8 });

    loader.init();
    expect(loader.done).toBe(true);
    const callsAfterInit = renderFn.mock.calls.length;

    loader.loadNext();
    expect(renderFn).toHaveBeenCalledTimes(callsAfterInit);
  });
});

describe('LazyLoader.destroy', () => {
  it('disconnects the observer, nulls _observer, and removes the sentinel', () => {
    const container = document.querySelector('#list');
    const renderFn = vi.fn();
    const loader = new LazyLoader({ container, items: makeItems(20), renderFn, batchSize: 8 });

    loader.init();
    const observer = loader._observer;
    const sentinel = loader._sentinel;

    loader.destroy();

    expect(observer.disconnect).toHaveBeenCalled();
    expect(loader._observer).toBeNull();
    expect(loader._sentinel).toBeNull();
    expect(sentinel.isConnected).toBe(false);
    expect(document.body.contains(sentinel)).toBe(false);
  });
});
