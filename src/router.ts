/**
 * @tracekit/nuxt - Router breadcrumbs
 *
 * Captures navigation changes as breadcrumbs via Vue Router's afterEach guard.
 * Nuxt uses Vue Router under the hood.
 */

import { addBreadcrumb } from '@tracekit/browser';

/**
 * Set up router breadcrumb capture via afterEach guard.
 *
 * @param router - Vue Router instance (from useRouter() in Nuxt)
 * @param parameterized - Use parameterized route paths (default: true)
 *
 * Usage in a Nuxt plugin:
 *   import { useRouter } from '#imports';
 *   const router = useRouter();
 *   setupRouterBreadcrumbs(router);
 */
export function setupRouterBreadcrumbs(
  router: any,
  parameterized: boolean = true,
): void {
  router.afterEach((to: any, from: any) => {
    const toPath = parameterized
      ? (to.matched?.[to.matched.length - 1]?.path ?? to.path)
      : to.fullPath;
    const fromPath = parameterized
      ? (from.matched?.[from.matched.length - 1]?.path ?? from.path)
      : from.fullPath;

    addBreadcrumb({
      category: 'navigation',
      message: `${fromPath} -> ${toPath}`,
      data: {
        from: fromPath,
        to: toPath,
      },
    });
  });
}
