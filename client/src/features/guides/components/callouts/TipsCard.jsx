import { CheckCircle, FileText, Clock, ExternalLink } from 'lucide-react';

const TipsCard = () => {
  return (
    <div className="bg-white rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 p-8 space-y-6 h-[320px] lg:h-auto lg:min-h-0 flex flex-col relative">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900 leading-tight">
          Before you proceed
        </h3>

        {/* MOBILE ICON BUTTON */}
        <button 
          className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all active:scale-95 shrink-0"
          title="View official resources"
        >
          <ExternalLink className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {/* ... (rest of the items) */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <CheckCircle className="w-5 h-5 text-teal-600" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[14px]">Double-check your details</p>
            <p className="text-[12px] text-slate-500 font-medium">
              Make sure names and information match your IDs
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1">
            <FileText className="w-5 h-5 text-teal-600" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[14px]">Prepare all requirements</p>
            <p className="text-[12px] text-slate-500 font-medium">
              Bring valid IDs and extra photocopies
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Clock className="w-5 h-5 text-teal-600" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[14px]">Check office availability</p>
            <p className="text-[12px] text-slate-500 font-medium">
              Confirm schedules and possible holidays
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP FULL BUTTON */}
      <button className="hidden lg:flex w-full items-center justify-center gap-2 
        border border-slate-200 text-slate-700 hover:bg-slate-50 
        font-bold py-3.5 rounded-xl transition-all text-[13px] active:scale-95">
        <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
        View official resources
      </button>
    </div>
  );
};

export default TipsCard;
