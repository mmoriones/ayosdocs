const steps = [
  { id: 1, title: "Find your specific guide", desc: "Browse or search for the document you need" },
  { id: 2, title: "Read step-by-step process", desc: "Follow clear instructions provided" },
  { id: 3, title: "Prepare requirements", desc: "Gather all necessary documents" },
  { id: 4, title: "Sign up to save progress", desc: "Track and manage your applications" },
];

const GettingStarted = () => {
  return (
    <div className="bg-ctp-mantle border border-ctp-surface0 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-ctp-text leading-none">
        Quick Guide
      </h3>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[10px] top-[10px] bottom-[15px] w-px bg-ctp-surface1"></div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3 relative">
              
              {/* circle */}
              <div className="z-10 flex items-center justify-center w-5 h-5 mt-[3px] rounded-full bg-ctp-sapphire text-ctp-base text-[10px] font-bold">
                {step.id}
              </div>

              {/* content */}
              <div className="space-y-0.5">
                <p className="text-[14px] font-bold text-ctp-text leading-tight">
                  {step.title}
                </p>
                <p className="text-[12px] text-ctp-subtext1 font-medium leading-snug">
                  {step.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
