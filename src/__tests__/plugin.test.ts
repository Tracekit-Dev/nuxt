import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@tracekit/browser', () => ({
  init: vi.fn(),
  captureException: vi.fn().mockReturnValue('event-id-123'),
  captureMessage: vi.fn().mockReturnValue('event-id-456'),
  setUser: vi.fn(),
}));

import { init, captureException, captureMessage, setUser } from '@tracekit/browser';
import { createTraceKitPlugin } from '../plugin';

function createMockNuxtApp() {
  const hooks: Record<string, Function> = {};
  return {
    hook: vi.fn((name: string, fn: Function) => {
      hooks[name] = fn;
    }),
    vueApp: { config: {} },
    _hooks: hooks,
  };
}

describe('createTraceKitPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a function', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    expect(typeof plugin).toBe('function');
  });

  it('plugin function calls init with config', () => {
    const config = { apiKey: 'test-key', environment: 'staging' };
    const plugin = createTraceKitPlugin(config);
    const nuxtApp = createMockNuxtApp();

    plugin(nuxtApp);

    expect(init).toHaveBeenCalledWith(config);
  });

  it('hooks into vue:error on nuxtApp', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    const nuxtApp = createMockNuxtApp();

    plugin(nuxtApp);

    expect(nuxtApp.hook).toHaveBeenCalledWith('vue:error', expect.any(Function));
  });

  it('vue:error handler calls captureException with component name and lifecycle info', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    const nuxtApp = createMockNuxtApp();

    plugin(nuxtApp);

    // Trigger the vue:error hook
    const error = new Error('Component error');
    const instance = { $options: { name: 'MyComponent' } };
    nuxtApp._hooks['vue:error'](error, instance, 'mounted');

    expect(captureException).toHaveBeenCalledWith(error, {
      componentName: 'MyComponent',
      lifecycleHook: 'mounted',
      handled: true,
    });
  });

  it('vue:error handler extracts __name when name is not available', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    const nuxtApp = createMockNuxtApp();

    plugin(nuxtApp);

    const error = new Error('Component error');
    const instance = { $options: { __name: 'ScriptSetupComponent' } };
    nuxtApp._hooks['vue:error'](error, instance, 'setup');

    expect(captureException).toHaveBeenCalledWith(error, {
      componentName: 'ScriptSetupComponent',
      lifecycleHook: 'setup',
      handled: true,
    });
  });

  it('vue:error handler uses Unknown when no component name available', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    const nuxtApp = createMockNuxtApp();

    plugin(nuxtApp);

    const error = new Error('Anonymous error');
    nuxtApp._hooks['vue:error'](error, null, 'render');

    expect(captureException).toHaveBeenCalledWith(error, {
      componentName: 'Unknown',
      lifecycleHook: 'render',
      handled: true,
    });
  });

  it('vue:error handler does not call captureException for non-Error values', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    const nuxtApp = createMockNuxtApp();

    plugin(nuxtApp);

    nuxtApp._hooks['vue:error']('string error', null, 'render');

    expect(captureException).not.toHaveBeenCalled();
  });

  it('returns provide object with tracekit composable functions', () => {
    const plugin = createTraceKitPlugin({ apiKey: 'test-key' });
    const nuxtApp = createMockNuxtApp();

    const result = plugin(nuxtApp);

    expect(result).toHaveProperty('provide');
    expect(result.provide).toHaveProperty('tracekit');
    expect(result.provide.tracekit.captureException).toBe(captureException);
    expect(result.provide.tracekit.captureMessage).toBe(captureMessage);
    expect(result.provide.tracekit.setUser).toBe(setUser);
  });
});
