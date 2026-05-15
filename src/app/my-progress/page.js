import { getAllGuides } from '@/lib/guides';
import ProgressClient from './ProgressClient';

export const metadata = {
  title: 'My Progress | AyosDocs',
  description: 'Track your Philippine government requirements and application progress.',
};

export default async function MyProgressPage() {
  const allGuides = getAllGuides();

  return (
    <ProgressClient allGuides={allGuides} />
  );
}
