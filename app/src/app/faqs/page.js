export const metadata = {
  title: 'Frequently Asked Questions | AyosDocs',
  description: 'Common questions about AyosDocs and navigating government requirements in the Philippines.',
};

export default function FAQsPage() {
  const faqs = [
    {
      question: "Is AyosDocs an official government website?",
      answer: "No, we're an independent team. AyosDocs isn't affiliated with any government agency—we simply gather info from official sources and organize it into guides that are easier to follow."
    },
    {
      question: "Is it free to use AyosDocs?",
      answer: "Absolutely. All our guides and tracking tools are free for everyone to use."
    },
    {
      question: "How often are the guides updated?",
      answer: "We keep a close eye on official announcements and update our content as soon as requirements or processes change."
    },
    {
      question: "Do I need an account to view guides?",
      answer: "Nope. You can browse every guide without an account. However, signing up lets you save your progress and keep track of where you are in a process."
    },
    {
      question: "Can I apply for documents directly through AyosDocs?",
      answer: "No. AyosDocs is a guide, not a filing service. We provide the instructions and links, but the actual application happens through the official government portals or offices."
    }
  ];

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="bg-ctp-mantle rounded-2xl p-8 md:p-14 shadow-sm border border-ctp-surface1 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
              Frequently Asked <span className="text-ctp-sky-800">Questions</span>
            </h1>
            <p className="text-lg text-ctp-subtext1 max-w-2xl mx-auto font-medium leading-relaxed">
              Got a question? We&apos;re here to help. If you can&apos;t find what you&apos;re looking for, feel free to contact us.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-8 rounded-xl border border-ctp-surface1 bg-ctp-base shadow-sm space-y-3 hover:shadow-md transition-shadow group">
                <h3 className="text-lg font-semibold text-ctp-text group-hover:text-ctp-sky-800 transition-colors">{faq.question}</h3>
                <p className="text-base text-ctp-subtext1 leading-relaxed font-medium opacity-80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <p className="text-ctp-subtext1 text-base font-medium">
            Still have questions? <a href="mailto:contact@ayosdocs.com" className="text-ctp-sky-800 font-bold hover:underline ml-2">Email contact@ayosdocs.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
