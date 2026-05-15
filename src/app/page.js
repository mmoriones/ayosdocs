import { getAllGuides } from '@/lib/guides';
import HomeClient from './HomeClient';

export const metadata = {
  title: 'AyosDocs | Your Complete Guide to Philippine Government Documents',
  description: 'Step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more.',
};

export default async function HomePage() {
  const allGuides = getAllGuides();

  return (
    <HomeClient allGuides={allGuides} />
  );
}
