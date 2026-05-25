import { bundles } from '@/data/bundles';
import { getAllGuides } from '@/lib/guides';
import BundleClient from './BundleWorkflowClient';
import { notFound } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const bundle = bundles.find(b => b.id === slug);
  
  if (!bundle) return { title: 'Bundle Not Found' };
  
  return {
    title: `${bundle.title} | AyosDocs Bundle`,
    description: bundle.description,
  };
}

export default async function BundlePage({ params }) {
  const { slug } = await params;
  const bundle = bundles.find(b => b.id === slug);
  
  if (!bundle) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  let isTracked = false;
  let savedProgress = [];

  if (session) {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    isTracked = user?.trackedBundles?.some(b => b.bundleId === slug) || false;
    savedProgress = JSON.parse(JSON.stringify(user?.savedProgress || []));
  }

  // Get all guides to pass metadata (title, icons, etc.) to the bundle view
  const allGuides = getAllGuides(true);

  return (
    <BundleClient 
      bundle={bundle} 
      allGuides={allGuides} 
      initialIsTracked={isTracked} 
      savedProgress={savedProgress}
    />
  );
}

export async function generateStaticParams() {
  return bundles.map((bundle) => ({
    slug: bundle.id,
  }));
}
