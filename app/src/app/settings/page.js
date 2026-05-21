import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export const metadata = {
  title: 'Settings | AyosDocs',
  description: 'Configure your application preferences and security settings.',
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return <SettingsClient />;
}
