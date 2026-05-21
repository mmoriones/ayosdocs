import PageHeader from '@/components/ui/PageHeader';
import { FileText, AlertTriangle, ShieldCheck, Scale, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | AyosDocs',
  description: 'Read the terms and conditions for using AyosDocs services and platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <PageHeader 
        icon={FileText}
        title="Terms of Use"
        description="Guidelines and rules for using the AyosDocs platform and services."
        actions={
          <div className="bg-ctp-base/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest text-ctp-mauve">Public Service</span>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Legal Agreement</h2>
              <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-widest">Last Updated: May 15, 2026</span>
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
              <div className="space-y-4">
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed italic">
                  Welcome to AyosDocs. By using our platform, you agree to comply with the following terms and conditions. Please read them carefully.
                </p>
              </div>

              <div className="p-6 bg-ctp-yellow/5 border border-ctp-yellow/20 rounded-xl flex items-center gap-6 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-ctp-base border border-ctp-yellow/20 flex items-center justify-center text-ctp-yellow shrink-0 shadow-sm">
                  <AlertTriangle size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ctp-text tracking-tight uppercase">Non-Government Entity Disclaimer</h4>
                  <p className="text-xs text-ctp-subtext1 mt-1 font-medium leading-relaxed">
                    AyosDocs is a private educational website. We do not represent any government agency and we are not an official document filing service.
                  </p>
                </div>
              </div>

              <div className="space-y-10 prose prose-ctp max-w-none prose-sm">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">1. Acceptance of Terms</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use AyosDocs if you do not agree to take all of the terms and conditions stated on this page.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">2. Use License</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    Permission is granted to temporarily view the materials on AyosDocs for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">3. User Accounts</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    When you create an account, you are responsible for maintaining the confidentiality of your login credentials. AyosDocs reserves the right to terminate accounts that violate these terms.
                  </p>
                </div>

                <div className="space-y-4 pt-8 border-t border-ctp-surface1">
                  <h3 className="text-base font-bold text-ctp-text tracking-tight uppercase">4. Governing Law</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed">
                    These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <aside className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 flex items-center gap-4 shadow-sm group">
              <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Scale size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-ctp-text uppercase tracking-widest">Compliance</h4>
                <p className="text-[10px] text-ctp-subtext1 font-medium leading-tight">Strict adherence to digital laws.</p>
              </div>
            </aside>
            <aside className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 flex items-center gap-4 shadow-sm group">
              <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-mauve shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Globe size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-ctp-text uppercase tracking-widest">Accessibility</h4>
                <p className="text-[10px] text-ctp-subtext1 font-medium leading-tight">Information for every citizen.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
