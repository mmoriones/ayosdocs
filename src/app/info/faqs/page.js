export const metadata = {
  title: 'Frequently Asked Questions | AyosDocs',
  description: 'Common questions about AyosDocs and navigating government requirements in the Philippines.',
};

export default function FAQsPage() {
  const faqs = [
    {
      question: "Is AyosDocs an official government website?",
      answer: "No, AyosDocs is an independent platform. We are not affiliated with any government agency. We consolidate information from official sources to provide easy-to-follow guides."
    },
    {
      question: "Is it free to use AyosDocs?",
      answer: "Yes, all our guides and progress tracking features are completely free for everyone."
    },
    {
      question: "How often are the guides updated?",
      answer: "We strive to update our content as soon as new information becomes available from official government announcements."
    },
    {
      question: "Do I need an account to view guides?",
      answer: "No, you can view all guides without an account. However, creating an account allows you to save your progress and access personalized features."
    },
    {
      question: "Can I apply for documents directly through AyosDocs?",
      answer: "No, AyosDocs only provides instructions and links to official portals. All actual applications must be done through the respective government agencies."
    }
  ];

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="bg-ctp-mantle rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-ctp-surface0 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-ctp-text tracking-tight uppercase">
              Frequently Asked <span className="text-ctp-sky-800">Questions</span>
            </h1>
            <p className="text-[18px] text-ctp-subtext1 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Got a question? We&apos;re here to help. If you can&apos;t find what you&apos;re looking for, feel free to contact us.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-8 rounded-[2rem] border border-ctp-surface0 bg-ctp-base shadow-sm space-y-3 hover:shadow-md transition-shadow group">
                <h3 className="text-[20px] font-black text-ctp-text tracking-tight uppercase group-hover:text-ctp-sky-800 transition-colors">{faq.question}</h3>
                <p className="text-[16px] text-ctp-subtext1 leading-relaxed font-medium opacity-80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <p className="text-ctp-subtext1 text-[16px] font-medium">
            Still have questions? <a href="mailto:contact@ayosdocs.com" className="text-ctp-sky-800 font-black hover:underline uppercase tracking-widest ml-2">Email contact@ayosdocs.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
