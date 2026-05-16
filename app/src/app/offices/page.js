import OfficesClient from './OfficesClient';

export const metadata = {
  title: 'Government Office Insights | AyosDocs',
  description: 'Real-time community data on Philippine government branches, wait times, and office ratings.',
};

export default function OfficesPage() {
  return <OfficesClient />;
}
