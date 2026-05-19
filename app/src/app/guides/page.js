import { getAllGuides } from '@/lib/guides';
import GuidesClient from './GuidesClient';

export const metadata = {
  title: 'All Guides | AyosDocs',
  description: 'Comprehensive step-by-step procedures for Philippine government requirements.',
};

export default async function GuidesPage() {
  const guides = getAllGuides(true);

  return (
    <GuidesClient initialGuides={guides} />
  );
}
