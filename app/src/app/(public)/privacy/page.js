import { PublicPageHeader, Card, Badge, Button } from '@/components/ui';
import { Shield, Lock, CheckCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | AyosDocs',
  description: 'Learn about how we collect, use, and protect your information at AyosDocs.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full pb-20 animate-in fade-in duration-700">
      <PublicPageHeader 
        icon={Shield}
        title="Privacy"
        description="Our commitment to protecting your personal information and tracking data."
        actions={
          <Badge variant="secondary" className="!bg-[#34C759]/10 !text-[#34C759] !border-none flex items-center gap-1.5 px-4 py-1.5">
            <Lock size={14} />
            <span className="text-[13px] font-bold uppercase tracking-wider">Privacy Standards</span>
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
              <h3 className="text-[19px] font-bold text-[#1C1C1E]">Document Overview</h3>
              <Badge variant="secondary" className="!bg-gray-100 !text-gray-500 !rounded-full px-4 py-1 text-[12px] font-bold w-fit">Effective: May 15, 2026</Badge>
            </div>
            
            <div className="p-6 lg:p-12 space-y-10 lg:space-y-12">
              <div className="space-y-4">
                <p className="text-[15px] lg:text-[17px] text-gray-500 font-medium leading-relaxed italic">
                  At AyosDocs, your privacy is a priority. This document outlines the types of information we collect and how it&apos;s used to improve your document tracking experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 lg:py-10 border-y border-gray-100/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center shadow-sm">
                      <Lock size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[15px] font-bold uppercase tracking-widest text-[#1C1C1E]">Data Security</h3>
                  </div>
                  <p className="text-[14px] text-gray-500 font-medium leading-relaxed">
                    We only store essential progress data. We never collect or store sensitive government IDs or private documents.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-[#34C759] flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[15px] font-bold uppercase tracking-widest text-[#1C1C1E]">User Control</h3>
                  </div>
                  <p className="text-[14px] text-gray-500 font-medium leading-relaxed">
                    You have full control over your tracking history. You can delete your progress data at any time from your settings.
                  </p>
                </div>
              </div>

              <div className="space-y-10 prose prose-gray max-w-none prose-sm lg:prose-base">
                <div className="space-y-4">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">1. Log Files</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    AyosDocs follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, and timestamps. This data is not linked to any personally identifiable information and is used solely for traffic analysis.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">2. Cookies and Web Beacons</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    We use &apos;cookies&apos; to store information including visitor preferences and the pages on the website that were accessed. The information is used to optimize the user experience by customizing our web page content based on browser type.
                  </p>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100/50">
                  <h3 className="text-[17px] lg:text-[19px] font-bold text-[#1C1C1E] tracking-tight uppercase">3. Consent</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-sm bg-white/80 backdrop-blur-xl p-6 lg:p-8 group relative" noPadding>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5 lg:gap-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-[#AF52DE] shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle size={24} strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[16px] lg:text-[17px] font-bold text-[#1C1C1E] uppercase tracking-wider">Questions about your data?</h4>
                  <p className="text-[13px] lg:text-[14px] text-gray-500 font-medium leading-relaxed max-w-sm">
                    Our security team is here to help clarify how your information is handled.
                  </p>
                </div>
              </div>
              <Button as={Link} href="/support" variant="secondary" className="h-14 !rounded-[20px] px-10 w-full md:w-auto !bg-white !border-gray-100 shadow-sm text-[15px] font-bold">
                Contact Privacy Team
              </Button>
            </div>
            
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#AF52DE]/5 blur-3xl rounded-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
