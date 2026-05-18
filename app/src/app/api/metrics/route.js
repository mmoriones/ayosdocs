import { NextResponse } from 'next/server';
import registry from '@/lib/metrics';
import connectDB from '@/lib/mongodb';

/**
 * GET /api/metrics
 * Exposes Prometheus metrics for scraping.
 */
export async function GET() {
  try {
    // Connect to DB if needed for other metrics later
    // await connectDB();
    
    // User Gauges removed temporarily

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
