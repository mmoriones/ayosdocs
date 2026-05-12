import SearchBar from './SearchBar';
import {
  FileText,
  ShieldCheck,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

import homeBlob from '../../../../assets/home_blob.webp';
import person from '../../../../assets/person.webp';

const Hero = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 lg:min-h-[calc(100vh-80px)] flex flex-col lg:justify-center pt-2 lg:pt-0">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="
            absolute
            top-[-120px]
            right-[-120px]
            w-[600px]
            h-[600px]
            rounded-full
            bg-teal-50
            blur-3xl
            opacity-70
          "
        />
      </div>

      <div
        className="
          relative z-10
          max-w-[1600px]
          mx-auto
          px-6 lg:px-10
          w-full
          pb-24 lg:pb-0
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1.05fr_0.95fr]
            items-center
            gap-8 lg:gap-12
            w-full
            pt-4 lg:pt-0
            lg:min-h-[600px]
            lg:-mt-12
          "
        >
          {/* LEFT SIDE */}
          <div className="max-w-[620px]">
            {/* GREETING */}
            <div className="mb-4 sm:mb-6">
              <span
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-teal-100
                  bg-teal-50
                  px-4 py-2
                  text-xs sm:text-sm
                  font-semibold
                  text-teal-700
                "
              >
                {isLoggedIn && user ? (
                  <>
                    {user.isNewUser ? 'Welcome to AyosDocs' : 'Welcome back'}, {user.fullName?.split(' ')[0] || 'User'}! 👋
                  </>
                ) : (
                  'Hi there! 👋'
                )}
              </span>
            </div>

            {/* TITLE + MOBILE ILLUSTRATION */}
            <div className="relative lg:block min-h-[160px] sm:min-h-[280px] lg:min-h-0">
              {/* MOBILE BLOB */}
              <img
                src={homeBlob}
                alt=""
                className="
                  lg:hidden
                  absolute
                  right-[-60px]
                  top-[-10px]
                  w-[260px]
                  sm:w-[420px]
                  max-w-none
                  opacity-40
                  pointer-events-none
                  z-0
                "
              />

              {/* TEXT */}
              <div className="relative z-10 max-w-[65%] sm:max-w-[70%] lg:max-w-none">
                <h1
                  className="
                    text-[30px]
                    sm:text-[44px]
                    md:text-[54px]
                    lg:text-[62px]
                    font-extrabold
                    tracking-[-0.04em]
                    leading-[1.05]
                    text-slate-900
                  "
                >
                  How can we{" "}
                  <br className="hidden sm:block" />
                  help you today?
                </h1>

                {/* DESCRIPTION */}
                <p
                  className="
                    mt-3 lg:mt-8
                    max-w-[240px] sm:max-w-xl lg:max-w-2xl
                    text-[13px] sm:text-base md:text-lg
                    leading-relaxed
                    text-slate-500
                    font-medium
                  "
                >
                  Find step-by-step guides for Philippine government
                  documents and official processes.
                </p>
              </div>

              {/* MOBILE ILLUSTRATION */}
              <div
                className="
                  lg:hidden
                  absolute
                  right-[-10px]
                  top-[-10px]
                  w-40 sm:w-64
                  h-40 sm:h-64
                  z-10
                "
              >
                <img
                  src={person}
                  alt="Person using laptop"
                  className="
                    w-full
                    h-full
                    object-contain
                    scale-110
                  "
                />

                {/* DOTS */}
                <div
                  className="
                    absolute
                    top-3
                    left-2
                    grid grid-cols-4 gap-1
                    opacity-20
                  "
                >
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-teal-600"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* SEARCH */}
            <div className="mt-6 lg:mt-12 max-w-3xl relative z-20">
              <SearchBar />
            </div>

            {/* FEATURES */}
            <div
              className="
                mt-8 lg:mt-12
                grid grid-cols-3
                gap-3 sm:gap-6 lg:gap-8
                text-slate-600
              "
            >
              {/* FEATURE 1 */}
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div
                  className="
                    p-2.5
                    rounded-xl
                    bg-teal-50
                    text-teal-600
                  "
                >
                  <FileText size={18} />
                </div>

                <div className="text-center sm:text-left">
                  <p
                    className="
                      font-bold
                      text-[10px] sm:text-sm
                      text-slate-800
                      leading-tight
                    "
                  >
                    Step-by-step guides
                  </p>

                  <p
                    className="
                      text-[9px] sm:text-xs
                      text-slate-500
                      mt-1
                    "
                  >
                    Easy to follow
                  </p>
                </div>
              </div>

              {/* FEATURE 2 */}
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div
                  className="
                    p-2.5
                    rounded-xl
                    bg-violet-50
                    text-violet-600
                  "
                >
                  <ShieldCheck size={18} />
                </div>

                <div className="text-center sm:text-left">
                  <p
                    className="
                      font-bold
                      text-[10px] sm:text-sm
                      text-slate-800
                      leading-tight
                    "
                  >
                    Official processes
                  </p>

                  <p
                    className="
                      text-[9px] sm:text-xs
                      text-slate-500
                      mt-1
                    "
                  >
                    Trusted info
                  </p>
                </div>
              </div>

              {/* FEATURE 3 */}
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div
                  className="
                    p-2.5
                    rounded-xl
                    bg-amber-50
                    text-amber-600
                  "
                >
                  <Clock size={18} />
                </div>

                <div className="text-center sm:text-left">
                  <p
                    className="
                      font-bold
                      text-[10px] sm:text-sm
                      text-slate-800
                      leading-tight
                    "
                  >
                    Track your progress
                  </p>

                  <p
                    className="
                      text-[9px] sm:text-xs
                      text-slate-500
                      mt-1
                    "
                  >
                    Stay on top
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE DESKTOP */}
          <div
            className="
              hidden lg:flex
              relative
              items-center
              justify-center
              h-[520px]
            "
          >
            {/* MAIN COMPOSITION */}
            <div className="relative w-full max-w-[560px] h-[520px]">
              {/* BLOB */}
              <img
                src={homeBlob}
                alt=""
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-contain
                  opacity-95
                "
              />

              {/* TOP LEFT DOTS */}
              <div
                className="
                  absolute
                  top-16
                  left-10
                  grid grid-cols-4
                  gap-2
                  opacity-20
                "
              >
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-teal-600"
                  />
                ))}
              </div>

              {/* PERSON */}
              <img
                src={person}
                alt="Person using laptop"
                className="
                  absolute
                  bottom-10
                  left-1/2
                  -translate-x-1/2
                  w-[460px]
                  object-contain
                  z-20
                "
              />

              {/* FLOOR LINE */}
              <div
                className="
                  absolute
                  bottom-12
                  left-1/2
                  -translate-x-1/2
                  w-[78%]
                  h-[2px]
                  rounded-full
                  bg-teal-700/20
                "
              />

              {/* BOTTOM RIGHT DOTS */}
              <div
                className="
                  absolute
                  bottom-20
                  right-4
                  grid grid-cols-4
                  gap-3
                  opacity-15
                "
              >
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-teal-600"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPLORE GUIDES */}
      <div
        className="
          absolute
          bottom-6 lg:bottom-10
          left-1/2
          -translate-x-1/2
          flex flex-col items-center
          gap-1
          text-teal-600
          z-20
        "
      >
        <span
          className="
            text-[10px] lg:text-[11px]
            font-extrabold
            uppercase
            tracking-[0.2em]
          "
        >
          Accomplish Your Goals
        </span>

        <div className="animate-bounce">
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </div>
    </section>
  );
};

export default Hero;