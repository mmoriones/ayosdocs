export const metadata = {
  title: 'Privacy Policy | AyosDocs',
  description: 'Learn about how we collect, use, and protect your information at AyosDocs.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-2xl p-8 md:p-14 shadow-sm border border-ctp-surface1 space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
              Privacy <span className="text-ctp-sky-800">Policy</span>
            </h1>
            <p className="text-xs font-medium text-ctp-subtext1">Last Updated: May 15, 2026</p>
          </header>

          <div className="space-y-10 text-ctp-subtext1 leading-relaxed text-base font-medium">
            <p>
              At AyosDocs, accessible from ayosdocs.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AyosDocs and how we use it.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ctp-text">1. Log Files</h2>
              <p>
                AyosDocs follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ctp-text">2. Cookies and Web Beacons</h2>
              <p>
                Like any other website, AyosDocs uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ctp-text">3. Advertising Partners</h2>
              <p>
                Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ctp-text">4. Information We Collect</h2>
              <p>
                If you create an account, we collect your name and email address via Google OAuth. We use this information to provide personalized features like progress tracking. We do not sell or share your personal data with third parties.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-ctp-text">5. Consent</h2>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
