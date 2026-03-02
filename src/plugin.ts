/**
 * @tracekit/nuxt - Plugin factory
 *
 * Provides createTraceKitPlugin (returns a function for defineNuxtPlugin)
 * and setupTraceKitPlugin (for inline setup in defineNuxtPlugin).
 *
 * Note: This package does NOT import from '#imports' (Nuxt auto-import)
 * because that is only available inside a Nuxt project. Instead, the
 * developer creates plugins/tracekit.client.ts in their Nuxt project
 * which imports from @tracekit/nuxt and uses #imports for defineNuxtPlugin.
 */

import {
  init,
  captureException,
  captureMessage,
  setUser,
} from '@tracekit/browser';
import type { TraceKitNuxtConfig } from './types';

/**
 * Create a TraceKit plugin function suitable for use inside defineNuxtPlugin.
 *
 * Usage:
 *   import { defineNuxtPlugin } from '#imports';
 *   import { createTraceKitPlugin } from '@tracekit/nuxt';
 *   export default defineNuxtPlugin(createTraceKitPlugin({ apiKey: '...' }));
 */
export function createTraceKitPlugin(config: TraceKitNuxtConfig) {
  return function traceKitPluginSetup(nuxtApp: any) {
    // Initialize the browser SDK
    init(config);

    // Hook into vue:error for component error capture
    nuxtApp.hook(
      'vue:error',
      (err: unknown, instance: any, info: string) => {
        const componentName =
          instance?.$options?.name ||
          instance?.$options?.__name ||
          'Unknown';

        if (err instanceof Error) {
          captureException(err, {
            componentName,
            lifecycleHook: info,
            handled: true,
          });
        }

        // Does NOT swallow the error -- Nuxt's vue:error hook naturally propagates
        // Per locked decision: capture then re-throw
      },
    );

    // Provide composable functions via useNuxtApp().$tracekit
    return {
      provide: {
        tracekit: {
          captureException,
          captureMessage,
          setUser,
        },
      },
    };
  };
}

/**
 * Convenience function for inline setup inside an existing defineNuxtPlugin.
 *
 * Usage:
 *   import { defineNuxtPlugin } from '#imports';
 *   import { setupTraceKitPlugin } from '@tracekit/nuxt';
 *   export default defineNuxtPlugin((nuxtApp) => {
 *     const provided = setupTraceKitPlugin(nuxtApp, { apiKey: '...' });
 *     // ... additional plugin setup
 *     return provided;
 *   });
 */
export function setupTraceKitPlugin(
  nuxtApp: any,
  config: TraceKitNuxtConfig,
) {
  const pluginFn = createTraceKitPlugin(config);
  return pluginFn(nuxtApp);
}
