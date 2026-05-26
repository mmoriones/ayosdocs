import { getAllGuides } from '@/lib/guides';
import HomeClient from './HomeClient';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'AyosDocs | Your Complete Guide to Philippine Government Documents',
  description: 'Step-by-step guides for Philippine government documents and processes. Simplify your requirements for TIN, SSS, PhilHealth, and more.',
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const hasGuestAccess = cookieStore.get('guest-access');

  if (!session && !hasGuestAccess) {
    redirect('/login');
  }

  const allGuides = getAllGuides(true);

  return (
    <HomeClient allGuides={allGuides} />
  );
}
