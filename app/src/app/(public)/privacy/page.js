import { PublicPageHeader, Card, Badge, Button } from '@/components/ui';
import { Shield, Lock, CheckCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | AyosDocs',
  description: 'Learn about how we collect, use, and protect your information at AyosDocs.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full pb-32 animate-in fade-in duration-700 relative overflow-hidden">
      <PublicPageHeader 
        icon={Shield}
        title="Privacy"
        description="Our commitment to protecting your personal information and tracking data."
        actions={
          <Badge variant="secondary" className="!bg-[#34C759]/10 !text-[#34C759] !border-none flex items-center gap-2 px-4 py-2 rounded-full shadow-sm">
            <Lock size={14} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-widest">Privacy Standards</span>
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
              <h3 className="text-[20px] lg:text-[22px] font-black text-[#1C1C1E] tracking-tight">Document Overview</h3>
              <Badge variant="secondary" className="!bg-gray-100/80 !text-gray-500 !rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border border-white/60">Effective: May 15, 2026</Badge>
            </div>
            
            <div className="p-8 lg:p-12 space-y-10 lg:space-y-16">
              <div className="space-y-6">
                <p className="text-[16px] lg:text-[18px] text-gray-500 font-medium leading-relaxed italic border-l-4 border-[#0038A8]/20 pl-6">
                  At AyosDocs, your privacy is a priority. This document outlines the types of information we collect and how it&apos;s used to improve your document tracking experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 lg:py-12 border-y border-gray-100/50 relative">
                <div className="space-y-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/50 text-[#007AFF] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                      <Lock size={22} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[15px] font-black uppercase tracking-[0.2em] text-[#1C1C1E]">Data Security</h3>
                  </div>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    We only store essential progress data. We never collect or store sensitive government IDs or private documents.
                  </p>
                </div>
                <div className="space-y-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100/50 text-[#34C759] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                      <CheckCircle2 size={22} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[15px] font-black uppercase tracking-[0.2em] text-[#1C1C1E]">User Control</h3>
                  </div>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                    You have full control over your tracking history. You can delete your progress data at any time from your settings.
                  </p>
                </div>
              </div>

              <div className="space-y-12 prose prose-gray max-w-none prose-sm lg:prose-base">
                <div className="space-y-5">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">1. Log Files</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    AyosDocs follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, and timestamps. This data is not linked to any personally identifiable information and is used solely for traffic analysis.
                  </p>
                </div>

                <div className="space-y-5">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">2. Cookies and Web Beacons</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    We use &apos;cookies&apos; to store information including visitor preferences and the pages on the website that were accessed. The information is used to optimize the user experience by customizing our web page content based on browser type.
                  </p>
                </div>

                <div className="space-y-5 pt-8">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#1C1C1E] tracking-tight uppercase border-b border-gray-100 pb-4">3. Consent</h3>
                  <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#007AFF]/5 blur-[100px] rounded-full pointer-events-none" />
          </Card>

          <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 group relative" noPadding>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6 lg:gap-8">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[24px] bg-purple-50 flex items-center justify-center text-[#AF52DE] shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle size={28} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[17px] lg:text-[19px] font-black text-[#1C1C1E] uppercase tracking-tight">Questions about your data?</h4>
                  <p className="text-[14px] lg:text-[15px] text-gray-500 font-medium leading-relaxed max-w-sm">
                    Our security team is here to help clarify how your information is handled.
                  </p>
                </div>
              </div>
              <Button as={Link} href="/support" className="h-16 !rounded-[24px] px-12 w-full md:w-auto bg-[#0038A8] text-white shadow-lg shadow-[#0038A8]/20 text-[16px] font-black active:scale-95 transition-all">
                Contact Team
              </Button>
            </div>
            
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#AF52DE]/5 blur-3xl rounded-full" />
          </Card>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] -left-20 w-80 h-80 bg-[#34C759]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] -right-20 w-96 h-96 bg-[#007AFF]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
