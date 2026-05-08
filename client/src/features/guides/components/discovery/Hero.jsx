import SearchBar from './SearchBar';
import { FileText, ShieldCheck, Clock, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section
      className="
        relative
        min-h-[calc(100vh-80px)]
        flex items-center
        max-w-7xl
        mx-auto
        overflow-hidden
        px-6 lg:px-8
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
      >
        <div
          className="
            absolute
            top-[-120px]
            right-[-120px]
            w-[600px]
            h-[600px]
            bg-teal-50
            rounded-full
            blur-3xl
            opacity-70
          "
        />
      </div>

      <div
        className="
          relative z-10
          grid
          grid-cols-1
          lg:grid-cols-2
          items-center
          gap-16 lg:gap-8
          w-full
          pt-12 lg:pt-0
          pb-24 lg:pb-0
          lg:-mt-20
        "
      >
        {/* LEFT SIDE */}
        <div className="max-w-2xl">
          {/* GREETING */}
          <div className="mb-6">
            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-teal-100
                bg-teal-50
                px-4 py-2
                text-sm font-semibold
                text-teal-700
              "
            >
              Hi there! 👋
            </span>
          </div>

          {/* TITLE */}
          <h1
            className="
              text-[40px]
              md:text-[54px]
              lg:text-[64px]
              font-black
              tracking-[-0.05em]
              leading-[1.02]
              text-slate-900
            "
          >
            How can we help
            <br />
            you today?
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-7
              max-w-xl
              text-lg md:text-xl
              leading-relaxed
              text-slate-500
            "
          >
            Find step-by-step guides for Philippine government
            documents and official processes.
          </p>

          {/* SEARCH */}
          <div className="mt-10 max-w-3xl">
            <SearchBar />
          </div>

          {/* FEATURES */}
          <div className="mt-12 flex flex-wrap md:flex-nowrap items-center gap-x-10 gap-y-6 text-slate-600">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Step-by-step guides</p>
                <p className="text-[13px] text-slate-500">Easy to follow</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Official processes</p>
                <p className="text-[13px] text-slate-500">Trusted information</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Track your progress</p>
                <p className="text-[13px] text-slate-500">Stay on top</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            relative
            flex
            justify-center
            lg:justify-end
            items-end
            h-[420px]
            md:h-[520px]
          "
        >
          {/* COMBINED BLOB */}
          <img
            src="/home_blob.svg"
            alt=""
            className="
              absolute
              left-1/2 -translate-x-[46%]
              lg:left-auto lg:-right-8 lg:translate-x-0
              bottom-0
              w-[380px]
              md:w-[500px]
              lg:w-[580px]
              object-contain
              pointer-events-none
              z-[5]
            "
          />

          {/* MAIN ILLUSTRATION (Top-most) */}
          <img
            src="/person.svg"
            alt="Person using laptop"
            className="
              relative z-20
              w-[340px]
              md:w-[420px]
              lg:w-[500px]
              object-contain
            "
          />

          {/* DECORATIVE DOTS - TOP LEFT (Above Blob) */}
          <div 
            className="
              absolute 
              top-20 md:top-24
              left-12 md:left-20 
              lg:left-30
              grid grid-cols-4 gap-2 
              opacity-20 z-10
            "
          >
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            ))}
          </div>

          {/* DECORATIVE DOTS - BOTTOM RIGHT (Behind Blob) */}
          <div 
            className="
              absolute 
              bottom-12 md:bottom-16
              right-8 md:right-12
              lg:-right-12
              grid grid-cols-3 gap-4 
              opacity-15 z-0
            "
          >
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-teal-600" />
            ))}
          </div>

          {/* FLOOR LINE */}
          <div
            className="
              absolute
              bottom-8
              w-[90%]
              h-[3px]
              rounded-full
              bg-teal-700/20
            "
          />
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          hidden xl:flex
          flex-col items-center
          gap-2
          text-teal-600
        "
      >
        <span
          className="
            text-[11px]
            font-extrabold
            uppercase
            tracking-[0.2em]
          "
        >
          Explore Guides
        </span>

        <div className="animate-bounce">
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
