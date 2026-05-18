import { Registry, collectDefaultMetrics, Counter, Gauge } from 'prom-client';

/**
 * Global registry for Prometheus metrics.
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

// Custom Business Metrics
// We check if the metric exists in the registry before creating it 
// to prevent errors during Next.js build/HMR
export const guideViewCounter = registry.getSingleMetric('ayosdocs_guide_views_total') || new Counter({
  name: 'ayosdocs_guide_views_total',
  help: 'Total number of times a guide has been viewed',
  labelNames: ['slug'],
  registers: [registry]
});

export const userTotalGauge = registry.getSingleMetric('ayosdocs_users_total') || new Gauge({
  name: 'ayosdocs_users_total',
  help: 'Total number of registered users',
  registers: [registry]
});

export const userOnboardedGauge = registry.getSingleMetric('ayosdocs_users_onboarded_total') || new Gauge({
  name: 'ayosdocs_users_onboarded_total',
  help: 'Total number of users who completed onboarding',
  registers: [registry]
});

export const userSignupCounter = registry.getSingleMetric('ayosdocs_user_signups_total') || new Counter({
  name: 'ayosdocs_user_signups_total',
  help: 'Total number of new user signups',
  registers: [registry]
});

export default registry;
