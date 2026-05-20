import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllGuides } from '@/lib/guides';
import ProgressClient from './ProgressClient';

export const metadata = {
  title: 'My Docs | AyosDocs',
  description: 'Track your Philippine government requirements and application progress.',
};

export default async function MyProgressPage() {
  const session = await getServerSession(authOptions);
  const allGuides = getAllGuides(true);

  // If unverified, pass restricted flag to show a "locked" state
  const isRestricted = session && !session.user.isVerified;

  return (
    <ProgressClient allGuides={allGuides} isRestricted={isRestricted} />
  );
}
