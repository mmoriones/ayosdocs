export const metadata = {
  title: 'About AyosDocs | Our Mission and Vision',
  description: 'AyosDocs is your comprehensive companion for navigating government processes and essential document applications in the Philippines.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-2xl p-8 md:p-12 shadow-sm border border-ctp-surface1 space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
            About <span className="text-ctp-sky-800">AyosDocs</span>
          </h1>
          <p className="text-lg text-ctp-subtext1 leading-relaxed font-medium">
            AyosDocs is here to help you navigate Philippine government requirements without the headache. Our mission is to simplify the complex world of permits and IDs, providing easy-to-follow guides so you can spend less time in line and more time on what matters.
          </p>
          <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-ctp-surface1">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-ctp-text">Our Mission</h2>
              <p className="text-base text-ctp-subtext1 font-medium leading-relaxed">
                To empower Filipinos with clear, up-to-date, and practical information about government requirements, making public services accessible to everyone.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-ctp-text">Our Vision</h2>
              <p className="text-base text-ctp-subtext1 font-medium leading-relaxed">
                A Philippines where navigating government offices is stress-free, powered by digital tools that put the right information in the hands of every citizen.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-ctp-mantle rounded-2xl p-10 shadow-sm border border-ctp-surface1 space-y-6">
          <h2 className="text-2xl font-semibold text-ctp-text">Why AyosDocs?</h2>
          <p className="text-lg text-ctp-subtext1 leading-relaxed font-medium">
            Applying for a passport or NBI clearance shouldn&apos;t feel like a maze. We gather the latest info from official sources and break it down into simple, manageable steps. With our progress tracking, you can stay on top of your requirements and check them off as you go.
          </p>
        </section>
      </div>
    </div>
  );
}
