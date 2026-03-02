# @tracekit/nuxt

TraceKit integration for Nuxt applications. Provides auto-init plugin, `useTraceKit` composable, and router breadcrumbs.

## Installation

```bash
npm install @tracekit/nuxt @tracekit/browser
```

## Quick Start

### Using Nuxt Module

Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@tracekit/nuxt'],
  tracekit: {
    dsn: 'https://your-dsn@tracekit.dev/project',
    environment: 'production',
  },
});
```

### Using Composable

```vue
<script setup>
import { useTraceKit } from '@tracekit/nuxt';

const { captureException, setUser } = useTraceKit();

function handleError(error) {
  captureException(error);
}
</script>
```

## Configuration

| Option       | Type     | Default        | Description                              |
| ------------ | -------- | -------------- | ---------------------------------------- |
| `dsn`        | `string` | -              | Your TraceKit project DSN (required)     |
| `environment`| `string` | `'production'` | Deployment environment name              |
| `sampleRate` | `number` | `1.0`          | Trace sampling rate between 0.0 and 1.0  |

## Documentation

Full documentation: [https://app.tracekit.dev/docs/frontend/frameworks](https://app.tracekit.dev/docs/frontend/frameworks)

## License

MIT
