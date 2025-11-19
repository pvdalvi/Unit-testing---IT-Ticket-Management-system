import "@testing-library/jest-dom";

// Polyfill for ResizeObserver used by Recharts' ResponsiveContainer in tests
class ResizeObserver {
	constructor(callback) {
		this.callback = callback;
	}
	observe() {}
	unobserve() {}
	disconnect() {}
}

global.ResizeObserver = global.ResizeObserver || ResizeObserver;

// Mock window.alert in tests to avoid jsdom "not implemented" errors
global.alert = global.alert || jest.fn();
