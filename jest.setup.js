// Node 25 ships a built-in localStorage that throws without --localstorage-file.
// Mock it before any test module resolves.
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
