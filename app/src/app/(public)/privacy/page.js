import { PublicPageHeader, Card, Badge, Button } from '@/components/ui';
import { Shield, Lock, CheckCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | AyosDocs',
  description: 'Learn about how we collect, use, and protect your information at AyosDocs.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full pb-20 animate-in fade-in duration-500">
      <PublicPageHeader 
        icon={Shield}
        title="Privacy Policy"
        description="Our commitment to protecting your personal information and tracking data."
        actions={
          <Badge variant="sky">Privacy Standards</Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <Card 
            title="Document Overview"
            background="mantle"
            headerAction={
              <Badge variant="slate">Effective: May 15, 2026</Badge>
            }
            noPadding
          >
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
          </Card>

          <Card background="mantle" className="group relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-mauve shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle size={24} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Questions about your data?</h4>
                  <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed max-w-sm">
                    Our security team is here to help clarify how your information is handled and protected.
                  </p>
                </div>
              </div>
              <Button as={Link} href="/support" variant="secondary" className="bg-ctp-base px-8 w-full md:w-auto shadow-sm">
                Contact Privacy Team
              </Button>
            </div>
            
            {/* Subtle Decorative Element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-ctp-mauve/5 blur-3xl rounded-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
