import { describe, it, expect } from 'vitest';

describe('Basic Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify setup is working', () => {
    expect(true).toBeTruthy();
  });
});
