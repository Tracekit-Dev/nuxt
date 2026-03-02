import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@tracekit/browser', () => ({
  captureException: vi.fn().mockReturnValue('event-id-123'),
  captureMessage: vi.fn().mockReturnValue('event-id-456'),
  setUser: vi.fn(),
}));

import {
  captureException,
  captureMessage,
  setUser,
} from '@tracekit/browser';
import { useTraceKit } from '../composables';

describe('useTraceKit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns captureException function', () => {
    const composable = useTraceKit();
    expect(composable.captureException).toBeDefined();
    expect(typeof composable.captureException).toBe('function');
  });

  it('returns captureMessage function', () => {
    const composable = useTraceKit();
    expect(composable.captureMessage).toBeDefined();
    expect(typeof composable.captureMessage).toBe('function');
  });

  it('returns setUser function', () => {
    const composable = useTraceKit();
    expect(composable.setUser).toBeDefined();
    expect(typeof composable.setUser).toBe('function');
  });

  it('functions are the actual @tracekit/browser exports', () => {
    const composable = useTraceKit();
    expect(composable.captureException).toBe(captureException);
    expect(composable.captureMessage).toBe(captureMessage);
    expect(composable.setUser).toBe(setUser);
  });
});
