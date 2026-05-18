import { NextResponse } from 'next/server';
import registry, { userTotalGauge, userOnboardedGauge } from '@/lib/metrics';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/metrics
 * Exposes Prometheus metrics for scraping.
 */
export async function GET() {
  try {
    // Connect to DB to fetch fresh counts
    await connectDB();
    
    // Update Gauges before scraping
    const [totalUsers, onboardedUsers] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ onboarded: true })
    ]);

    userTotalGauge.set(totalUsers);
    userOnboardedGauge.set(onboardedUsers);

    const metrics = await registry.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': registry.contentType,
      },
    });
  } catch (error) {
    console.error('Metrics collection error:', error);
    return new NextResponse('Error collecting metrics', { status: 500 });
  }
}
