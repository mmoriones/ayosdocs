export const metadata = {
  title: 'About AyosDocs | Our Mission and Vision',
  description: 'AyosDocs is your comprehensive companion for navigating government processes and essential document applications in the Philippines.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-[2rem] p-8 md:p-12 shadow-sm border border-ctp-surface0 space-y-8">
          <h1 className="text-3xl md:text-5xl font-black text-ctp-text tracking-tight uppercase">
            About <span className="text-ctp-sky-800">AyosDocs</span>
          </h1>
          <p className="text-[20px] text-ctp-subtext1 leading-relaxed font-medium opacity-90">
            AyosDocs is your comprehensive companion for navigating government processes and essential document applications in the Philippines. Our mission is to simplify the often complex and confusing world of bureaucracy, providing clear, step-by-step guides to help you get things done efficiently.
          </p>
          <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-ctp-surface0">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">Our Mission</h2>
              <p className="text-[16px] text-ctp-subtext1 font-medium leading-relaxed">
                To empower Filipinos by providing accessible, up-to-date, and easy-to-understand information about government requirements and procedures.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ctp-text uppercase tracking-tight">Our Vision</h2>
              <p className="text-[16px] text-ctp-subtext1 font-medium leading-relaxed">
                A Philippines where every citizen can easily navigate public services without stress or confusion, utilizing digital tools for better accessibility.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-ctp-mantle rounded-[2rem] p-10 shadow-sm border border-ctp-surface0 space-y-6">
          <h2 className="text-3xl font-black text-ctp-text uppercase tracking-tight">Why AyosDocs?</h2>
          <p className="text-[18px] text-ctp-subtext1 leading-relaxed font-medium opacity-90">
            Applying for a passport, NBI clearance, or SSS registration shouldn&apos;t feel like a maze. We curate the latest information from official sources and break them down into manageable steps. With our built-in progress tracking, you can keep track of your requirements and never miss a step.
          </p>
        </section>
      </div>
    </div>
  );
}
