import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Terms and <span className="text-teal-600">Conditions</span>
          </h1>
          <p className="text-gray-500 italic">Last Updated: April 28, 2026</p>

          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>Welcome to AyosDocs!</p>
            <p>
              These terms and conditions outline the rules and regulations for the use of AyosDocs's Website, located at ayosdocs.com.
            </p>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">1. Acceptance of Terms</h2>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use AyosDocs if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">2. Disclaimer of Liability</h2>
              <p>
                The information provided on AyosDocs is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
              <p className="font-medium text-gray-700">
                AyosDocs is not a government agency and does not represent any government entity.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">4. Intellectual Property</h2>
              <p>
                Unless otherwise stated, AyosDocs and/or its licensors own the intellectual property rights for all material on AyosDocs. All intellectual property rights are reserved. You may access this from AyosDocs for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">5. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
