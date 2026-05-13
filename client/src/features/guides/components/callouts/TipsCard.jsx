import { CheckCircle, FileText, Clock, ExternalLink } from 'lucide-react';

const TipsCard = () => {
  return (
    <div className="bg-ctp-mantle rounded-[2rem] shadow-sm border border-ctp-surface0 p-8 space-y-8 flex flex-col relative transition-all">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[11px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] leading-none">
          Before you proceed
        </h3>

        {/* MOBILE ICON BUTTON */}
        <button 
          className="lg:hidden p-2.5 rounded-xl border border-ctp-surface0 text-ctp-subtext1 hover:text-ctp-green hover:bg-ctp-mantle transition-all active:scale-95 shrink-0 bg-ctp-base shadow-xs"
          title="View official resources"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* ITEM 1 */}
        <div className="flex items-start gap-5 group">
          <div className="mt-1 w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-green shrink-0 transition-transform group-hover:scale-110 border border-ctp-surface0 shadow-xs">
            <CheckCircle className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <p className="font-black text-ctp-text text-[15px] leading-tight mb-1 uppercase tracking-tight">Double-check details</p>
            <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed">
              Make sure names and information match your official IDs.
            </p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="flex items-start gap-5 group">
          <div className="mt-1 w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-green shrink-0 transition-transform group-hover:scale-110 border border-ctp-surface0 shadow-xs">
            <FileText className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <p className="font-black text-ctp-text text-[15px] leading-tight mb-1 uppercase tracking-tight">Prepare requirements</p>
            <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed">
              Bring valid IDs and multiple photocopies of each.
            </p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="flex items-start gap-5 group">
          <div className="mt-1 w-10 h-10 rounded-xl bg-ctp-base flex items-center justify-center text-ctp-green shrink-0 transition-transform group-hover:scale-110 border border-ctp-surface0 shadow-xs">
            <Clock className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <p className="font-black text-ctp-text text-[15px] leading-tight mb-1 uppercase tracking-tight">Check availability</p>
            <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed">
              Confirm schedules and check for local holidays.
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP FULL BUTTON */}
      <button className="hidden lg:flex w-full items-center justify-center gap-2 
        bg-ctp-base border border-ctp-surface0 text-ctp-text hover:bg-ctp-mantle 
        font-black py-4 rounded-xl transition-all text-[11px] active:scale-95 shadow-sm uppercase tracking-[0.2em]">
        <ExternalLink className="w-4 h-4" strokeWidth={3} />
        Official Resources
      </button>
    </div>
  );
};

export default TipsCard;
