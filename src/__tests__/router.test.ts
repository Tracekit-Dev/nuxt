import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@tracekit/browser', () => ({
  addBreadcrumb: vi.fn(),
}));

import { addBreadcrumb } from '@tracekit/browser';
import { setupRouterBreadcrumbs } from '../router';

function createMockRouter() {
  let afterEachCallback: Function | null = null;
  return {
    afterEach: vi.fn((cb: Function) => {
      afterEachCallback = cb;
    }),
    trigger(to: any, from: any) {
      afterEachCallback?.(to, from);
    },
  };
}

describe('setupRouterBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls router.afterEach', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router);

    expect(router.afterEach).toHaveBeenCalledOnce();
    expect(router.afterEach).toHaveBeenCalledWith(expect.any(Function));
  });

  it('afterEach callback calls addBreadcrumb with from/to paths', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router);

    router.trigger(
      { path: '/dashboard', fullPath: '/dashboard', matched: [] },
      { path: '/home', fullPath: '/home', matched: [] },
    );

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/home -> /dashboard',
      data: {
        from: '/home',
        to: '/dashboard',
      },
    });
  });

  it('parameterized mode uses matched route path', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router, true);

    router.trigger(
      {
        path: '/users/123',
        fullPath: '/users/123?tab=settings',
        matched: [
          { path: '/' },
          { path: '/users/:id' },
        ],
      },
      {
        path: '/home',
        fullPath: '/home',
        matched: [{ path: '/home' }],
      },
    );

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/home -> /users/:id',
      data: {
        from: '/home',
        to: '/users/:id',
      },
    });
  });

  it('non-parameterized mode uses fullPath', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router, false);

    router.trigger(
      {
        path: '/users/123',
        fullPath: '/users/123?tab=settings',
        matched: [{ path: '/users/:id' }],
      },
      {
        path: '/home',
        fullPath: '/home?ref=nav',
        matched: [{ path: '/home' }],
      },
    );

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/home?ref=nav -> /users/123?tab=settings',
      data: {
        from: '/home?ref=nav',
        to: '/users/123?tab=settings',
      },
    });
  });

  it('defaults to parameterized mode when not specified', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router);

    router.trigger(
      {
        path: '/posts/456',
        fullPath: '/posts/456',
        matched: [{ path: '/posts/:id' }],
      },
      {
        path: '/',
        fullPath: '/',
        matched: [{ path: '/' }],
      },
    );

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/ -> /posts/:id',
      data: {
        from: '/',
        to: '/posts/:id',
      },
    });
  });

  it('falls back to to.path when matched is empty', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router, true);

    router.trigger(
      { path: '/unknown', fullPath: '/unknown', matched: [] },
      { path: '/home', fullPath: '/home', matched: [] },
    );

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/home -> /unknown',
      data: {
        from: '/home',
        to: '/unknown',
      },
    });
  });
});
