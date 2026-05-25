'use client';

import { useState } from 'react';
import { 
  Star, 
  Clock, 
  Users, 
  Building2, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Zap,
  HelpCircle,
  MessageSquare,
  Lock,
  Loader2,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/context';
import { useAuthUI } from '@/components/Providers';
import { submitOfficeReportAction } from '@/app/actions/office';
import { Tooltip, Card, Input, Button, PageHeader } from '@/components/ui';

const STAR_VALUES = [1, 2, 3, 4, 5];

/**
 * StarRating component for the experience reporting form.
 */
const StarRating = ({ category, label, icon: Icon, value, hoverValue, onClick, onHover, disabled }) => {
  return (
    <div className={`bg-ctp-base border border-ctp-surface1 rounded-lg p-4 flex flex-col items-center text-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-ctp-sky-800/20 hover:bg-ctp-mantle/30 group'}`}>
      <div className="w-9 h-9 rounded-lg bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800 mb-3 group-hover:bg-ctp-base transition-colors shadow-sm">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <h4 className="text-ui-tiny font-bold text-ctp-subtext1 mb-3 uppercase tracking-widest leading-none">{label}</h4>
      <div className="flex items-center gap-1">
        {STAR_VALUES.map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onClick(category, star)}
            onMouseEnter={() => !disabled && onHover(category, star)}
            onMouseLeave={() => !disabled && onHover(category, 0)}
            className={`transition-all ${!disabled ? 'active:scale-90 hover:scale-110' : 'cursor-not-allowed'}`}
          >
            <Star
              size={16}
              strokeWidth={star <= (hoverValue || value) ? 0 : 2}
              className={`${
                star <= (hoverValue || value)
                  ? 'fill-ctp-yellow text-ctp-yellow'
                  : 'text-ctp-surface1'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * RadioGroup component for the experience reporting form.
 */
const RadioGroup = ({ label, name, options, value, onChange, tooltip, disabled }) => (
  <div className={`py-3.5 border-b border-ctp-surface1 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <div className="flex items-center gap-2">
      <label className="text-ui-micro font-bold text-ctp-text uppercase tracking-widest">{label}</label>
      {tooltip && (
        <Tooltip content={tooltip} delay={0}>
          <Info size={12} className="text-ctp-subtext1 cursor-help" strokeWidth={2.5} />
        </Tooltip>
      )}
    </div>
    <div className="flex flex-wrap items-center gap-5">
      {options.map((option) => (
        <label key={option.value} className={`flex items-center gap-2.5 group ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              disabled={disabled}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="peer appearance-none w-3.5 h-3.5 rounded-full border border-ctp-surface1 bg-ctp-base checked:border-ctp-sky-800 transition-all cursor-pointer shadow-sm"
            />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <span className={`text-ui-micro font-bold uppercase tracking-widest transition-colors ${value === option.value ? 'text-ctp-sky-800' : 'text-ctp-subtext1 group-hover:text-ctp-text'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

/**
 * RateClient Component
 */
export default function RateClient() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { openAuthModal } = useAuthUI();
  const { showToast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [officeSearch, setOfficeSearch] = useState('');
  const [selectedOffice, setSelectedOffice] = useState(null);
  
  const [formData, setFormData] = useState({
    visitDate: '',
    ratings: {
      speed: 0,
      friendliness: 0,
      management: 0,
      cleanliness: 0
    },
    appointment: '',
    waitingTime: '',
    extraRequirements: '',
    fixerActivity: '',
    comment: '',
    isAnonymous: false
  });

  const [hoverRatings, setHoverRatings] = useState({
    speed: 0,
    friendliness: 0,
    management: 0,
    cleanliness: 0
  });

  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;

  const { data: offices = [], isLoading: isLoadingOffices } = useQuery({
    queryKey: ['offices-search', officeSearch],
    queryFn: async () => {
      if (officeSearch.length < 2) return [];
      const response = await axios.get(`/api/offices?q=${encodeURIComponent(officeSearch)}`);
      return response.data;
    },
    enabled: officeSearch.length >= 2,
  });

  const handleRatingClick = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value }
    }));
  };

  const handleHoverRating = (category, value) => {
    setHoverRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOffice) {
      showToast({ type: 'warning', title: 'Office Required', message: 'Please select a government office first.' });
      return;
    }

    if (Object.values(formData.ratings).some(v => v === 0)) {
      showToast({ type: 'warning', title: 'Ratings Required', message: 'Please provide all performance ratings.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitOfficeReportAction({
        officeId: selectedOffice._id,
        ...formData
      });

      if (result.success) {
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Submission Failed', message: error.message || 'Failed to publish report.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-ctp-base">
        <div className="max-w-md w-full bg-ctp-mantle/50 rounded-xl border border-ctp-surface1 p-10 text-center space-y-8 shadow-sm">
          <div className="w-20 h-20 bg-ctp-green/[0.07] rounded-2xl flex items-center justify-center mx-auto text-ctp-green border border-ctp-green/20">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ctp-text tracking-tight uppercase">Report Received</h2>
            <p className="text-sm text-ctp-subtext1 leading-relaxed font-medium">
              Your contribution helps fellow Filipinos navigate government services with more confidence.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => router.push('/offices')}
              className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-white py-3 rounded-lg font-bold uppercase tracking-widest text-ui-micro transition-all shadow-lg shadow-ctp-sky-800/10 active:scale-[0.98]"
            >
              Back to Offices
            </button>
            <button 
              onClick={() => {
                setShowSuccess(false);
                setSelectedOffice(null);
                setOfficeSearch('');
                setFormData({
                  visitDate: '',
                  ratings: { speed: 0, friendliness: 0, management: 0, cleanliness: 0 },
                  appointment: '',
                  waitingTime: '',
                  extraRequirements: '',
                  fixerActivity: '',
                  comment: '',
                  isAnonymous: false
                });
              }}
              className="w-full py-3 rounded-lg font-bold uppercase tracking-widest text-ui-micro text-ctp-subtext1 bg-ctp-base/50 hover:bg-ctp-mantle transition-all border border-ctp-surface1"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <PageHeader 
        icon={Star}
        title="Report Experience"
        description="Share real-world insights to help other Filipinos navigate this office better."
        actions={
          <div className="bg-ctp-mantle/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-ctp-green animate-pulse shadow-[0_0_8px_rgba(166,227,161,0.5)]" />
            <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">Public Contribution</span>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-10">
        
        {!isLoggedIn || !isVerified ? (
          <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-500">
            <div className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-12 text-center space-y-6 shadow-sm relative overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
               <div className="w-16 h-16 bg-ctp-base border border-ctp-surface1 rounded-2xl flex items-center justify-center mx-auto text-ctp-subtext1 mb-4 shadow-inner relative z-10">
                  <Lock size={28} />
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-xl font-bold text-ctp-text uppercase tracking-tight">Authentication Required</h3>
                  <p className="text-sm text-ctp-subtext1 font-medium max-w-sm mx-auto">
                    To maintain report quality, only verified community members can submit office experiences.
                  </p>
               </div>
               <button 
                 onClick={openAuthModal}
                 className="px-10 py-3 bg-ctp-sky-800 text-white rounded-lg font-bold text-ui-micro uppercase tracking-widest shadow-lg shadow-ctp-sky-800/10 hover:bg-ctp-sky-800/90 active:scale-[0.98] transition-all relative z-10"
               >
                 Sign in to Unlock
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in duration-500">
            <div className="flex-1 min-w-0 space-y-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Office Details */}
                <Card title="Office Selection" background="mantle" className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm" overflow="visible">
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        {!selectedOffice ? (
                          <div className="relative group">
                            <Input 
                              label="Search Government Office"
                              placeholder="e.g. DFA Aseana, NBI Manila..."
                              value={officeSearch}
                              onChange={(e) => setOfficeSearch(e.target.value)}
                              maxLength={100}
                              leftIcon={Search}
                              className="bg-ctp-base/50"
                            />
                            
                            {officeSearch.length >= 2 && (
                              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-ctp-mantle border border-ctp-surface1 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {isLoadingOffices ? (
                                  <div className="p-6 text-center text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest flex items-center justify-center gap-3">
                                    <Loader2 size={14} className="animate-spin" strokeWidth={3} />
                                    Searching...
                                  </div>
                                ) : offices.length > 0 ? (
                                  <div className="divide-y divide-ctp-surface1/30 max-h-60 overflow-y-auto custom-scrollbar">
                                    {offices.map((office) => (
                                      <button
                                        key={office._id}
                                        type="button"
                                        onClick={() => setSelectedOffice(office)}
                                        className="w-full px-4 py-3.5 text-left hover:bg-ctp-base transition-all flex items-center justify-between group"
                                      >
                                        <div className="min-w-0">
                                          <h4 className="text-ui-micro font-bold text-ctp-text group-hover:text-ctp-sky-800 transition-colors uppercase tracking-tight truncate">{office.name}</h4>
                                          <p className="text-ui-tiny text-ctp-subtext1 mt-0.5 font-bold uppercase tracking-widest opacity-60 truncate">{office.city}, {office.province}</p>
                                        </div>
                                        <ArrowRight size={12} className="text-ctp-sky-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-6 text-center text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-widest">No branches found</div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <label className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-[0.15em] ml-1">Selected Location</label>
                            <div className="bg-ctp-sky-800/[0.04] border border-ctp-sky-800/20 rounded-lg p-4 flex items-center justify-between group shadow-sm">
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-lg bg-ctp-base border border-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 shadow-inner">
                                  <Building2 size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                  <h4 className="text-ui-micro font-bold text-ctp-text uppercase tracking-tight leading-tight">{selectedOffice.name}</h4>
                                  <p className="text-ui-micro text-ctp-subtext1 font-bold uppercase tracking-widest opacity-60 mt-1">{selectedOffice.city}, {selectedOffice.province}</p>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => { setSelectedOffice(null); setOfficeSearch(''); }}
                                className="px-3 py-1.5 rounded-md bg-ctp-base border border-ctp-surface1 text-ui-tiny font-bold text-ctp-sky-800 uppercase tracking-widest hover:border-ctp-sky-800/30 transition-all shadow-sm"
                              >
                                Change
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="max-w-xs lg:ml-auto">
                        <Input 
                          required
                          label="Date of Visit"
                          type="date" 
                          max={new Date().toISOString().split('T')[0]}
                          value={formData.visitDate}
                          onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                          className="bg-ctp-base/50"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Performance Ratings */}
                <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-yellow shadow-inner">
                      <Star size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest leading-none">Performance Ratings</h2>
                      <p className="text-ui-micro text-ctp-subtext1 font-bold uppercase tracking-widest mt-1 opacity-70">Rate based on your actual experience.</p>
                    </div>
                  </div>
                  
                  <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-5">
                    <StarRating category="speed" label="Processing Speed" icon={Clock} value={formData.ratings.speed} hoverValue={hoverRatings.speed} onClick={handleRatingClick} onHover={handleHoverRating} />
                    <StarRating category="friendliness" label="Staff Behavior" icon={Users} value={formData.ratings.friendliness} hoverValue={hoverRatings.friendliness} onClick={handleRatingClick} onHover={handleHoverRating} />
                    <StarRating category="management" label="Queue Flow" icon={Users} value={formData.ratings.management} hoverValue={hoverRatings.management} onClick={handleRatingClick} onHover={handleHoverRating} />
                    <StarRating category="cleanliness" label="Environment" icon={Building2} value={formData.ratings.cleanliness} hoverValue={hoverRatings.cleanliness} onClick={handleRatingClick} onHover={handleHoverRating} />
                  </div>
                </section>

                {/* Detailed Insights */}
                <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-peach shadow-inner">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest leading-none">Detailed Insights</h2>
                      <p className="text-ui-micro text-ctp-subtext1 font-bold uppercase tracking-widest mt-1 opacity-70">Helpful context for other applicants.</p>
                    </div>
                  </div>

                  <div className="p-8 divide-y divide-ctp-surface1/50">
                    <RadioGroup 
                      label="Appointment Availability" 
                      name="appointment"
                      tooltip="How difficult was it to secure an online appointment slot?"
                      options={[{ label: 'Easy', value: 'easy' }, { label: 'Moderate', value: 'moderate' }, { label: 'Difficult', value: 'difficult' }]}
                      value={formData.appointment}
                      onChange={(val) => setFormData({...formData, appointment: val})}
                    />
                    <RadioGroup 
                      label="Actual Waiting Time" 
                      name="waitingTime"
                      tooltip="Total time spent at the office including queueing."
                      options={[{ label: '< 1 Hour', value: 'fast' }, { label: '1–3 Hours', value: 'medium' }, { label: 'Whole Day', value: 'slow' }]}
                      value={formData.waitingTime}
                      onChange={(val) => setFormData({...formData, waitingTime: val})}
                    />
                    <RadioGroup 
                      label="Extra requirements requested?" 
                      name="extraRequirements"
                      tooltip="Were you asked for documents not listed on the official guide?"
                      options={[{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }]}
                      value={formData.extraRequirements}
                      onChange={(val) => setFormData({...formData, extraRequirements: val})}
                    />
                    <RadioGroup 
                      label="Fixer/Scalper activity noticed?" 
                      name="fixerActivity"
                      tooltip="Did you notice individuals offering paid speed-up services?"
                      options={[{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }]}
                      value={formData.fixerActivity}
                      onChange={(val) => setFormData({...formData, fixerActivity: val})}
                    />
                  </div>
                </section>

                {/* Feedback Comment */}
                <section className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-mauve shadow-inner">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest leading-none">Your Feedback</h2>
                      <p className="text-ui-micro text-ctp-subtext1 font-bold uppercase tracking-widest mt-1 opacity-70">Share a pro-tip or detail (Optional).</p>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <textarea 
                      rows="4" 
                      maxLength={500}
                      placeholder="e.g. Bring your own pen, the Xerox machine is currently out of order..."
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      className="w-full px-6 py-4 bg-ctp-base/50 border border-ctp-surface1 rounded-xl text-sm font-medium focus:outline-none focus:border-ctp-sky-800 transition-all resize-none shadow-inner"
                    />
                    <div className="flex justify-between items-center text-ui-tiny font-bold uppercase tracking-widest text-ctp-subtext1 opacity-60 px-2">
                      <span>Honest community feedback only</span>
                      <span>{formData.comment.length}/500</span>
                    </div>
                  </div>
                </section>

                <div className="flex justify-end pt-4">
                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="px-12 py-3.5 bg-ctp-sky-800 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-ctp-sky-800/20 hover:bg-ctp-sky-800/90 active:scale-[0.98] transition-all flex items-center gap-3"
                   >
                     {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          <span>Submit Community Report</span>
                        </>
                      )}
                   </button>
                </div>
              </form>
            </div>

            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden group">
                <div className="p-4 border-b border-ctp-surface1 flex items-center gap-2">
                  <HelpCircle size={14} className="text-ctp-sky-800" />
                  <h3 className="text-ui-micro font-bold text-ctp-subtext0 uppercase tracking-[0.15em]">Guidelines</h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-ui-micro font-medium leading-relaxed text-ctp-subtext1">
                    Help your fellow citizens by providing objective, helpful feedback about this branch.
                  </p>
                  <div className="space-y-2.5 pt-2">
                    {[
                      "Be specific about wait times",
                      "Mention current branch issues",
                      "Avoid personal attacks"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <CheckCircle2 size={12} className="text-ctp-green opacity-70" strokeWidth={3} />
                        <span className="text-ui-micro font-bold text-ctp-subtext1 uppercase tracking-tight">{text}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={() => router.push('/offices')}
                    className="w-full text-ui-micro uppercase tracking-widest shadow-lg shadow-ctp-sky-800/5"
                  >
                    View All Offices
                  </Button>
                </div>
              </Card>

              <div className="bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-ctp-peach">
                  <AlertCircle size={16} />
                  <h4 className="text-ui-micro font-bold uppercase tracking-widest text-ctp-text">Data Privacy</h4>
                </div>
                <p className="text-ui-micro text-ctp-subtext1 font-medium leading-relaxed opacity-90 uppercase tracking-tight">
                  Your report is moderated to ensure it contains no personal information. It helps keep our community safe and informed.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
