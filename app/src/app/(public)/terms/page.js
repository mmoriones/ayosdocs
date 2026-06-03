import { PublicPageHeader, Card, Badge, Banner } from '@/components/ui';
import { FileText, AlertTriangle, ShieldCheck, Scale, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | AyosDocs',
  description: 'Read the terms and conditions for using AyosDocs services and platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-full pb-32 animate-in fade-in duration-700 relative overflow-hidden">
      <PublicPageHeader 
        icon={FileText}
        title="Terms"
        description="Guidelines and rules for using the AyosDocs platform and services."
        actions={
          <Badge variant="secondary" className="!bg-[#AF52DE]/10 !text-[#AF52DE] !border-none flex items-center gap-2 px-4 py-2 rounded-full shadow-sm">
            <Scale size={14} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-widest">Public Service</span>
          </Badge>
        }
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-4 space-y-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10 lg:space-y-12">
          <Card 
            className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl relative"
            noPadding
          >
            <div className="p-8 lg:p-10 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-[20px] lg:text-[22px] font-black text-[#1C1C1E] tracking-tight">Legal Agreement</h3>
              <Badge variant="secondary" className="!bg-gray-100/80 !text-gray-500 !rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border border-white/60">Last Updated: May 15, 2026</Badge>
            </div>

            <div className="p-8 lg:p-12 space-y-10 lg:space-y-16">
              <div className="space-y-6">
                <p className="text-[16px] lg:text-[18px] text-gray-500 font-medium leading-relaxed italic border-l-4 border-[#FF9500]/20 pl-6">
                  Welcome to AyosDocs. By using our platform, you agree to comply with the following terms and conditions. Please read them carefully.
                </p>
              </div>

              <Banner 
                variant="orange" 
                icon={AlertTriangle} 
                title="Non-Government Entity Disclaimer"
                className="!rounded-[28px] !p-8 lg:!p-10 shadow-sm border-orange-100/50"
              >
                AyosDocs is a private educational website. We do not represent any government agency and we are not an official document filing service.
              </Banner>

              <div className="space-y-12 prose prose-gray max-w-none prose-sm lg:prose-base">
                <div className="space-y-5">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">1. Acceptance of Terms</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use AyosDocs if you do not agree to take all of the terms and conditions stated on this page.
                  </p>
                </div>

                <div className="space-y-5">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">2. Use License</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    Permission is granted to temporarily view the materials on AyosDocs for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                </div>

                <div className="space-y-5">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">3. User Accounts</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    When you create an account, you are responsible for maintaining the confidentiality of your login credentials. AyosDocs reserves the right to terminate accounts that violate these terms.
                  </p>
                </div>

                <div className="space-y-5 pt-8">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">4. Governing Law</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9500]/5 blur-[100px] rounded-full pointer-events-none" />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-12">
            <Card 
              className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 flex items-center gap-6 group interactive"
              noPadding
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-[#007AFF] shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Scale size={28} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[17px] font-black text-[#1C1C1E] uppercase tracking-tight">Compliance</h4>
                <p className="text-[14px] text-gray-500 font-medium leading-tight mt-1">Strict adherence to digital laws.</p>
              </div>
            </Card>
            <Card 
              className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 flex items-center gap-6 group interactive"
              noPadding
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-[#AF52DE] shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Globe size={28} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[17px] font-black text-[#1C1C1E] uppercase tracking-tight">Accessibility</h4>
                <p className="text-[14px] text-gray-500 font-medium leading-tight mt-1">Information for every citizen.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] -right-20 w-80 h-80 bg-[#AF52DE]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] -left-20 w-96 h-96 bg-[#FF9500]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
