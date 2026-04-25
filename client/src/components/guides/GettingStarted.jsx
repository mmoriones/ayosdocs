const steps = [
  { id: 1, title: "Find your specific guide", desc: "Browse or search for the document you need" },
  { id: 2, title: "Read step-by-step process", desc: "Follow clear instructions provided" },
  { id: 3, title: "Prepare requirements", desc: "Gather all necessary documents" },
  { id: 4, title: "Sign up to save progress", desc: "Track and manage your applications" },
];

const GettingStarted = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Getting Started
      </h3>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[10px] top-[10px] bottom-[15px] w-px bg-gray-200"></div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3 relative">
              
              {/* circle */}
              <div className="z-10 flex items-center justify-center w-5 h-5 mt-[3.5px] rounded-full bg-teal-600 text-white text-[10px] font-medium">
                {step.id}
              </div>

              {/* content */}
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {step.title}
                </p>
                <p className="text-[13px] text-gray-500 leading-snug">
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
