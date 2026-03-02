import type { TracekitBrowserConfig, SeverityLevel, UserContext } from '@tracekit/browser';

export interface TraceKitNuxtConfig extends TracekitBrowserConfig {
  parameterizedRoutes?: boolean; // default: true
}

export interface TraceKitComposable {
  captureException: (
    error: Error,
    context?: Record<string, unknown>,
  ) => string;
  captureMessage: (message: string, level?: SeverityLevel) => string;
  setUser: (user: UserContext | null) => void;
}
