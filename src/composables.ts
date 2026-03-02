/**
 * @tracekit/nuxt - useTraceKit composable
 *
 * Provides captureException, captureMessage, setUser from @tracekit/browser.
 * Works inside Nuxt component setup since the SDK is already initialized
 * by the plugin.
 *
 * This avoids depending on useNuxtApp() from #imports which isn't available
 * in the npm package context. Instead, imports directly from @tracekit/browser.
 */

import {
  captureException,
  captureMessage,
  setUser,
} from '@tracekit/browser';
import type { TraceKitComposable } from './types';

/**
 * Composable that provides TraceKit error capture functions.
 *
 * Usage in a Nuxt component:
 *   const { captureException, captureMessage, setUser } = useTraceKit();
 */
export function useTraceKit(): TraceKitComposable {
  return {
    captureException,
    captureMessage,
    setUser,
  };
}
