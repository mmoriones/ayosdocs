import { getAllGuides } from '@/lib/guides';
import { bundles } from '@/data/bundles';
import { NextResponse } from 'next/server';

export async function GET() {
  const guides = getAllGuides(true);
  
  const searchableGuides = guides.map(g => ({
    id: g.slug,
    title: g.title,
    description: g.description,
    category: g.category,
    type: 'guide',
    href: `/guides/${g.slug}`
  }));

  const searchableBundles = bundles.map(b => ({
    id: b.id,
    title: b.title,
    description: b.description,
    category: b.category,
    type: 'bundle',
    href: `/bundles/${b.id}`
  }));

  return NextResponse.json([
    ...searchableGuides,
    ...searchableBundles
  ]);
}
