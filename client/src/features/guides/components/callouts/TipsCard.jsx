import { CheckCircle, FileText, Clock, ExternalLink } from 'lucide-react';

const TipsCard = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-8 h-[320px] lg:h-auto lg:min-h-0 flex flex-col relative transition-all">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          Before you proceed
        </h3>

        {/* MOBILE ICON BUTTON */}
        <button 
          className="lg:hidden p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all active:scale-95 shrink-0 bg-gray-50/50"
          title="View official resources"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* ITEM 1 */}
        <div className="flex items-start gap-4 group">
          <div className="mt-1 w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 transition-transform group-hover:scale-110">
            <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-[14px] leading-tight mb-1">Double-check details</p>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Make sure names and information match your official IDs.
            </p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="flex items-start gap-4 group">
          <div className="mt-1 w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 transition-transform group-hover:scale-110">
            <FileText className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-[14px] leading-tight mb-1">Prepare requirements</p>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Bring valid IDs and multiple photocopies of each.
            </p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="flex items-start gap-4 group">
          <div className="mt-1 w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 transition-transform group-hover:scale-110">
            <Clock className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-[14px] leading-tight mb-1">Check availability</p>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Confirm schedules and check for local holidays.
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP FULL BUTTON */}
      <button className="hidden lg:flex w-full items-center justify-center gap-2 
        border border-gray-100 text-gray-700 hover:bg-gray-50 
        font-bold py-3.5 rounded-xl transition-all text-[12px] active:scale-95 shadow-xs uppercase tracking-wider">
        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
        Official Resources
      </button>
    </div>
  );
};

export default TipsCard;
