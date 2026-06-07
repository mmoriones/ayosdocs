import { getAllGuides } from '@/lib/guides';
import GuidesClient from './GuidesClient';

export const metadata = {
  title: 'Guides Library | AyosDocs',
  description: 'Comprehensive step-by-step procedures for Philippine government requirements.',
};

export default async function GuidesPage({ searchParams }) {
  const guides = getAllGuides(true);
  const initialCategory = (await searchParams)?.category || null;

  return (
    <GuidesClient initialGuides={guides} initialCategory={initialCategory} />
  );
}
