import React, { useEffect } from 'react';

const FAQs = () => {
  useEffect(() => {
    document.title = "Frequently Asked Questions | AyosDocs";
  }, []);

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
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-2xl p-8 md:p-12 shadow-sm border border-ctp-surface0 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
              Frequently Asked <span className="text-ctp-sapphire">Questions</span>
            </h1>
            <p className="text-ctp-subtext1 max-w-2xl mx-auto">
              Got a question? We're here to help. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl border border-ctp-surface0 bg-ctp-base/50 space-y-2">
                <h3 className="text-lg font-semibold text-ctp-text">{faq.question}</h3>
                <p className="text-ctp-subtext1 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <p className="text-ctp-subtext0">
            Still have questions? <span className="text-ctp-sapphire font-medium cursor-pointer hover:underline">Email contact@ayosdocs.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
