import PageHeader from '@/components/ui/PageHeader';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | AyosDocs',
  description: 'Learn about how we collect, use, and protect your information at AyosDocs.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <PageHeader 
        icon={Shield}
        title="Privacy Policy"
        description="Our commitment to protecting your personal information and tracking data."
        actions={
          <div className="bg-ctp-mantle/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Privacy Standards</span>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Document Overview</h2>
              <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Effective: May 15, 2026</span>
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
              <div className="space-y-4">
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed italic">
                  At AyosDocs, your privacy is a priority. This document outlines the types of information we collect and how it&apos;s used to improve your document tracking experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-ctp-surface1/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-ctp-sky-800/10 text-ctp-sky-800 flex items-center justify-center shadow-inner">
                      <Lock size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ctp-text">Data Security</h3>
                  </div>
                  <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed">
                    We only store essential progress data. We never collect or store sensitive government IDs or private documents.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-ctp-green/[0.07] text-ctp-green flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-ctp-text">User Control</h3>
                  </div>
                  <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed">
                    You have full control over your tracking history. You can delete your progress data at any time from your settings.
                  </p>
                </div>
              </div>

              <div className="space-y-10 prose prose-ctp max-w-none prose-sm">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">1. Log Files</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    AyosDocs follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, and timestamps. This data is not linked to any personally identifiable information and is used solely for traffic analysis.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">2. Cookies and Web Beacons</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    We use &apos;cookies&apos; to store information including visitor preferences and the pages on the website that were accessed. The information is used to optimize the user experience by customizing our web page content based on browser type.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">3. Advertising Partners</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    Third-party ad servers or ad networks use technologies like cookies that are sent directly to users&apos; browsers. You may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
                  </p>
                </div>

                <div className="space-y-4 pt-8 border-t border-ctp-surface1">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">4. Consent</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm group">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ctp-text uppercase tracking-tight">Questions about your data?</h4>
              <p className="text-xs text-ctp-subtext1 font-medium leading-tight">Reach out to our security team for clarification.</p>
            </div>
            <Link href="/contact" className="px-6 py-2 bg-ctp-base border border-ctp-surface1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-ctp-subtext1 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 transition-all shadow-sm active:scale-95">
              Contact Privacy Team
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
