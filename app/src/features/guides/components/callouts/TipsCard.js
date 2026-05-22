import { CheckCircle, FileText, Clock, ExternalLink } from 'lucide-react';
import { Tooltip } from '@/components/ui';

const TipsCard = () => {
  return (
    <div className="bg-ctp-mantle rounded-xl shadow-sm border border-ctp-surface1 p-6 space-y-6 flex flex-col relative transition-all">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[11px] font-semibold text-ctp-sky-800 uppercase tracking-[0.2em] leading-none opacity-70">
          Before you proceed
        </h3>

        <Tooltip content="View official resources">
          <button 
            className="lg:hidden p-2 rounded-lg border border-ctp-surface1 text-ctp-sky-800 hover:bg-ctp-surface0 transition-all active:scale-95 shrink-0 bg-ctp-base"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={2} />
          </button>
        </Tooltip>
      </div>

      <div className="space-y-5 flex-1">
        <div className="flex items-start gap-4 group">
          <div className="mt-0.5 w-9 h-9 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shrink-0 border border-ctp-surface1 shadow-sm">
            <CheckCircle className="w-4.5 h-4.5" strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-ctp-text text-[14px] leading-tight mb-1">Double-check details</p>
            <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed">
              Make sure names and information match your official IDs.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="mt-0.5 w-9 h-9 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shrink-0 border border-ctp-surface1 shadow-sm">
            <FileText className="w-4.5 h-4.5" strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-ctp-text text-[14px] leading-tight mb-1">Prepare requirements</p>
            <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed">
              Bring valid IDs and multiple photocopies of each.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 group">
          <div className="mt-0.5 w-9 h-9 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-sky-800 shrink-0 border border-ctp-surface1 shadow-sm">
            <Clock className="w-4.5 h-4.5" strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-ctp-text text-[14px] leading-tight mb-1">Check availability</p>
            <p className="text-[13px] text-ctp-subtext1 font-medium leading-relaxed">
              Confirm schedules and check for local holidays.
            </p>
          </div>
        </div>
      </div>

      <button className="hidden lg:flex w-full items-center justify-center gap-2 
        bg-ctp-base border border-ctp-surface1 text-ctp-sky-800 hover:bg-ctp-surface0 
        font-semibold py-3 rounded-lg transition-all text-[12px] active:scale-95 shadow-sm">
        <ExternalLink className="w-4 h-4" strokeWidth={2} />
        Official Resources
      </button>
    </div>
  );
};

export default TipsCard;
