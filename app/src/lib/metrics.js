import { Registry, collectDefaultMetrics } from 'prom-client';

/**
 * Global registry for Prometheus metrics.
 * Using a global variable ensures the registry persists across hot reloads in development.
 */
let registry;

if (global.prometheusRegistry) {
  registry = global.prometheusRegistry;
} else {
  registry = new Registry();
  registry.setDefaultLabels({
    app: 'ayosdocs'
  });

  collectDefaultMetrics({ register: registry });
  global.prometheusRegistry = registry;
}

export default registry;
