import { PublicPageHeader, Card, Badge, Banner } from '@/components/ui';
import { FileText, AlertTriangle, ShieldCheck, Scale, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | AyosDocs',
  description: 'Read the terms and conditions for using AyosDocs services and platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-full pb-20 animate-in fade-in duration-500">
      <PublicPageHeader 
        icon={FileText}
        title="Terms of Use"
        description="Guidelines and rules for using the AyosDocs platform and services."
        actions={
          <Badge variant="mauve">Public Service</Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <Card 
            title="Legal Agreement"
            background="mantle"
            headerAction={
              <Badge variant="slate">Last Updated: May 15, 2026</Badge>
            }
            noPadding
          >
            <div className="p-8 md:p-12 space-y-12">
              <div className="space-y-4">
                <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed italic">
                  Welcome to AyosDocs. By using our platform, you agree to comply with the following terms and conditions. Please read them carefully.
                </p>
              </div>

              <Banner 
                variant="orange" 
                icon={AlertTriangle} 
                title="Non-Government Entity Disclaimer"
              >
                AyosDocs is a private educational website. We do not represent any government agency and we are not an official document filing service.
              </Banner>

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
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              background="mantle" 
              interactive 
              className="flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Scale size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-ctp-text uppercase tracking-widest">Compliance</h4>
                <p className="text-ui-micro text-ctp-subtext1 font-medium leading-tight">Strict adherence to digital laws.</p>
              </div>
            </Card>
            <Card 
              background="mantle" 
              interactive 
              className="flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-mauve shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Globe size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-ctp-text uppercase tracking-widest">Accessibility</h4>
                <p className="text-ui-micro text-ctp-subtext1 font-medium leading-tight">Information for every citizen.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
