export const metadata = {
  title: 'Terms and Conditions | AyosDocs',
  description: 'Read the terms and conditions for using AyosDocs services and platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-[2rem] p-8 md:p-14 shadow-sm border border-ctp-surface0 space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-ctp-text tracking-tight uppercase">
              Terms and <span className="text-ctp-sky-800">Conditions</span>
            </h1>
            <p className="text-[12px] font-black text-ctp-subtext0 uppercase tracking-[0.3em]">Last Updated: May 15, 2026</p>
          </header>

          <div className="space-y-10 text-ctp-subtext1 leading-relaxed text-[16px] font-medium opacity-90">
            <p>Welcome to AyosDocs!</p>
            <p>
              These terms and conditions outline the rules and regulations for the use of AyosDocs&apos;s Website, located at ayosdocs.com.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">1. Acceptance of Terms</h2>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use AyosDocs if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">2. Disclaimer of Liability</h2>
              <p>
                The information provided on AyosDocs is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
              <div className="bg-ctp-sky-800/5 border-l-4 border-ctp-sky-800 p-4 rounded-r-xl italic font-black text-ctp-text">
                AyosDocs is not a government agency and does not represent any government entity.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">4. Intellectual Property</h2>
              <p>
                Unless otherwise stated, AyosDocs and/or its licensors own the intellectual property rights for all material on AyosDocs. All intellectual property rights are reserved. You may access this from AyosDocs for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">5. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
