import { Machine } from './machine';

describe('Machine', () => {
  it('should create an instance', () => {
    expect(new Machine(1, '50', 0, 0)).toBeTruthy();
  });
});
