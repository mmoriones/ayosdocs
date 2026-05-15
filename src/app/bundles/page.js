import { bundles } from '@/data/bundles';
import BundlesClient from './BundlesClient';

export const metadata = {
  title: 'Life Event Bundles | AyosDocs',
  description: 'Explore bundled requirements for your major life milestones and goals.',
};

export default function BundlesPage() {
  return (
    <BundlesClient initialBundles={bundles} />
  );
}
