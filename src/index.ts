/**
 * @tracekit/nuxt - Public API
 * @package @tracekit/nuxt
 *
 * Nuxt integration for TraceKit with:
 * - Auto-init plugin via createTraceKitPlugin
 * - useTraceKit composable for components
 * - Router breadcrumb capture
 */

// Plugin
export { createTraceKitPlugin, setupTraceKitPlugin } from './plugin';

// Composable
export { useTraceKit } from './composables';

// Router breadcrumbs
export { setupRouterBreadcrumbs } from './router';

// Re-export browser SDK functions for convenience
export {
  init,
  captureException,
  captureMessage,
  setUser,
  setTag,
  setExtra,
  addBreadcrumb,
  getClient,
} from '@tracekit/browser';

// Types
export type { TraceKitNuxtConfig, TraceKitComposable } from './types';
