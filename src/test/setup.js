import '@testing-library/jest-dom/vitest'

// jsdom gaps used by Radix Select / cmdk
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

for (const key of ['hasPointerCapture', 'setPointerCapture', 'releasePointerCapture']) {
  if (!(key in Element.prototype)) {
    Object.defineProperty(Element.prototype, key, {
      value: key === 'hasPointerCapture' ? () => false : () => {},
      configurable: true,
    })
  }
}

// cmdk calls scrollIntoView on items; jsdom's stub can be incomplete.
Element.prototype.scrollIntoView = function () {}
