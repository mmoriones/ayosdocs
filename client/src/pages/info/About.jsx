import React, { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    document.title = "About AyosDocs | Our Mission and Vision";
  }, []);

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-2xl p-8 md:p-12 shadow-sm border border-ctp-surface0 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
            About <span className="text-ctp-sapphire">AyosDocs</span>
          </h1>
          <p className="text-lg text-ctp-subtext1 leading-relaxed">
            AyosDocs is your comprehensive companion for navigating government processes and essential document applications in the Philippines. Our mission is to simplify the often complex and confusing world of bureaucracy, providing clear, step-by-step guides to help you get things done efficiently.
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-ctp-text">Our Mission</h2>
              <p className="text-ctp-subtext1">
                To empower Filipinos by providing accessible, up-to-date, and easy-to-understand information about government requirements and procedures.
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-ctp-text">Our Vision</h2>
              <p className="text-ctp-subtext1">
                A Philippines where every citizen can easily navigate public services without stress or confusion, utilizing digital tools for better accessibility.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-ctp-mantle rounded-2xl p-8 shadow-sm border border-ctp-surface0 space-y-4">
          <h2 className="text-2xl font-bold text-ctp-text">Why AyosDocs?</h2>
          <p className="text-ctp-subtext1 leading-relaxed">
            Applying for a passport, NBI clearance, or SSS registration shouldn't feel like a maze. We curate the latest information from official sources and break them down into manageable steps. With our built-in progress tracking, you can keep track of your requirements and never miss a step.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
