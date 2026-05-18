import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Temporary Admin Dashboard Placeholder.
 * This page is only accessible via admin.ayosdocs.com for authenticated admins.
 */
export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Security Check: Redirect to login if not authenticated or not an admin
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              AyosDocs Admin Console
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Welcome to the internal management system.
            </p>
          </div>
          <Link href="/login" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors border border-gray-600">
            Sign Out
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors cursor-pointer border border-gray-600">
            <h3 className="text-xl font-bold">User Management</h3>
            <p className="text-sm text-gray-400 mt-2">Manage accounts and roles.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors cursor-pointer border border-gray-600">
            <h3 className="text-xl font-bold">Guide Editor</h3>
            <p className="text-sm text-gray-400 mt-2">Update and publish new guides.</p>
          </div>
          <a 
            href="/grafana/" 
            className="p-6 bg-blue-900 rounded-xl hover:bg-blue-800 transition-colors cursor-pointer border border-blue-700"
          >
            <h3 className="text-xl font-bold">Grafana Metrics</h3>
            <p className="text-sm text-blue-200 mt-2">View system performance →</p>
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500 italic">
            Host: admin.ayosdocs.com | Next.js Middleware Enabled
          </p>
        </div>
      </div>
    </div>
  );
}
