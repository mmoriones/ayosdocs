import { Registry, collectDefaultMetrics, Counter, Gauge } from 'prom-client';

/**
 * Prometheus metrics registry singleton.
 * Uses global to persist across hot-reloads and module re-evaluations.
 */
if (!global._prometheusRegistry) {
  const registry = new Registry();
  registry.setDefaultLabels({
    app: 'ayosdocs'
  });

  // Collect default system metrics (GC, memory, etc.)
  collectDefaultMetrics({ register: registry });
  
  global._prometheusRegistry = registry;
}

const registry = global._prometheusRegistry;

// Custom Business Metrics
// We use registry.getSingleMetric to ensure we don't try to re-register the same metric
// which would throw an error.
export const guideViewCounter = registry.getSingleMetric('ayosdocs_guide_views_total') || new Counter({
  name: 'ayosdocs_guide_views_total',
  help: 'Total number of times a guide has been viewed',
  labelNames: ['slug'],
  registers: [registry]
});

export default registry;
