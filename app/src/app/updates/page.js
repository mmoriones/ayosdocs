import { getAllGuides } from '@/lib/guides';
import UpdatesClient from './UpdatesClient';

export const metadata = {
  title: 'Recent Updates | AyosDocs',
  description: 'Stay informed about the latest changes in government requirements and procedures.',
};

export default async function UpdatesPage() {
  const allGuides = getAllGuides(true);
  
  // Sort all guides by lastUpdated
  const sortedUpdates = allGuides
    .filter(g => g.lastUpdated)
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

  return (
    <UpdatesClient initialUpdates={sortedUpdates} />
  );
}
