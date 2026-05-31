import { PublicPageHeader, Card, Badge, Banner } from '@/components/ui';
import { FileText, AlertTriangle, ShieldCheck, Scale, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | AyosDocs',
  description: 'Read the terms and conditions for using AyosDocs services and platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-full pb-20 animate-in fade-in duration-700">
      <PublicPageHeader 
        icon={FileText}
        title="Terms"
        description="Guidelines and rules for using the AyosDocs platform and services."
        actions={
          <Badge variant="secondary" className="!bg-[#AF52DE]/10 !text-[#AF52DE] !border-none flex items-center gap-1.5 px-4 py-1.5">
            <Scale size={14} />
            <span className="text-[13px] font-bold uppercase tracking-wider">Public Service</span>
          </Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 lg:mt-12 space-y-8 lg:space-y-12">
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-10">
          <Card 
            className="!rounded-[32px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl"
            noPadding
          >
            <div className="p-6 lg:p-8 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-[19px] font-bold text-[#1C1C1E]">Legal Agreement</h3>
              <Badge variant="secondary" className="!bg-gray-100 !text-gray-500 !rounded-full px-4 py-1 text-[12px] font-bold w-fit">Last Updated: May 15, 2026</Badge>
            </div>

            <div className="p-6 lg:p-12 space-y-10 lg:space-y-12">
              <div className="space-y-4">
                <p className="text-[15px] lg:text-[17px] text-gray-500 font-medium leading-relaxed italic">
                  Welcome to AyosDocs. By using our platform, you agree to comply with the following terms and conditions. Please read them carefully.
                </p>
              </div>

              <Banner 
                variant="orange" 
                icon={AlertTriangle} 
                title="Non-Government Entity Disclaimer"
                className="!rounded-[24px] !p-6 lg:!p-8"
              >
                AyosDocs is a private educational website. We do not represent any government agency and we are not an official document filing service.
              </Banner>

              <div className="space-y-10 prose prose-gray max-w-none prose-sm lg:prose-base">
                <div className="space-y-4">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">1. Acceptance of Terms</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use AyosDocs if you do not agree to take all of the terms and conditions stated on this page.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">2. Use License</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    Permission is granted to temporarily view the materials on AyosDocs for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">3. User Accounts</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    When you create an account, you are responsible for maintaining the confidentiality of your login credentials. AyosDocs reserves the right to terminate accounts that violate these terms.
                  </p>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100/50">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">4. Governing Law</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pb-12">
            <Card 
              className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 flex items-center gap-5 group interactive"
              noPadding
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#007AFF] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Scale size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold text-[#1C1C1E] uppercase tracking-wider">Compliance</h4>
                <p className="text-[12px] text-gray-500 font-medium leading-tight mt-0.5">Strict adherence to digital laws.</p>
              </div>
            </Card>
            <Card 
              className="!rounded-[28px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 flex items-center gap-5 group interactive"
              noPadding
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#AF52DE] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Globe size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold text-[#1C1C1E] uppercase tracking-wider">Accessibility</h4>
                <p className="text-[12px] text-gray-500 font-medium leading-tight mt-0.5">Information for every citizen.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
