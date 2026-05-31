import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';
import { getAllGuides } from '@/lib/guides';

export const metadata = {
  title: 'Profile | AyosDocs',
  description: 'Manage your personal information and account security.',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const allGuides = getAllGuides(true);

  return <ProfileClient allGuides={allGuides} />;
}
