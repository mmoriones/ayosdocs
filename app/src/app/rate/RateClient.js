'use client';

import { useState } from 'react';
import { 
  Star, 
  Clock, 
  Users, 
  Building2, 
  Info, 
  Search, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Banner from '@/components/ui/Banner';
import { useToast } from '@/context/ToastContext';
import Image from 'next/image';

const STAR_VALUES = [1, 2, 3, 4, 5];

/**
 * StarRating component for the experience reporting form.
 */
const StarRating = ({ category, label, icon: Icon, value, hoverValue, onClick, onHover }) => {
  return (
    <div className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-5 flex flex-col items-center text-center shadow-sm hover:border-ctp-surface2 transition-all">
      <div className="w-10 h-10 rounded-lg bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 mb-3">
        <Icon size={20} />
      </div>
      <h4 className="text-xs font-semibold text-ctp-subtext1 mb-3 uppercase tracking-wider">{label}</h4>
      <div className="flex items-center gap-1">
        {STAR_VALUES.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onClick(category, star)}
            onMouseEnter={() => onHover(category, star)}
            onMouseLeave={() => onHover(category, 0)}
            className="transition-transform active:scale-90"
          >
            <Star
              size={20}
              className={`${
                star <= (hoverValue || value)
                  ? 'fill-ctp-yellow text-ctp-yellow'
                  : 'text-ctp-surface2'
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
const RadioGroup = ({ label, name, options, value, onChange, tooltip }) => (
  <div className="py-5 border-b border-ctp-surface1 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-ctp-text">{label}</label>
      {tooltip && <Info size={14} className="text-ctp-subtext0 cursor-help" />}
    </div>
    <div className="flex flex-wrap items-center gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="peer appearance-none w-4 h-4 rounded-full border border-ctp-surface2 checked:border-ctp-sky-800 transition-all cursor-pointer bg-ctp-base"
            />
            <div className="absolute w-2 h-2 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <span className={`text-sm transition-colors ${value === option.value ? 'font-semibold text-ctp-text' : 'text-ctp-subtext1 group-hover:text-ctp-text'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

/**
 * RateClient Component
 * Handles the structured experience reporting for government offices.
 */
export default function RateClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    agency: '',
    branch: '',
    dateVisited: '',
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

  const handleRatingClick = (category, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value }
    }));
  };

  const handleHoverRating = (category, value) => {
    setHoverRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      showToast({
        type: 'success',
        title: 'Report Submitted',
        message: 'Thank you for sharing your experience! It helps the community.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-ctp-base rounded-2xl border border-ctp-surface1 p-8 md:p-10 text-center space-y-8 shadow-sm">
          <div className="w-20 h-20 bg-ctp-green/10 rounded-full flex items-center justify-center mx-auto text-ctp-green border border-ctp-green/20">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ctp-text">Report Received!</h2>
            <p className="text-base text-ctp-subtext1 leading-relaxed">
              Your contribution helps fellow Filipinos navigate government services with more confidence. Your report will be visible after a short moderation period.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/offices')}
              className="w-full bg-ctp-sky-800 hover:bg-ctp-sky-800/90 text-ctp-base py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              Back to Offices
            </button>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full py-3.5 rounded-xl font-semibold text-ctp-subtext1 hover:bg-ctp-mantle transition-all text-sm"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20 text-ctp-text">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-ctp-sky-800">
              <MessageSquare size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Experience Sharing</span>
            </div>
            <h1 className="text-3xl font-bold text-ctp-text tracking-tight">Share Your Experience</h1>
            <p className="text-ctp-subtext1 text-lg">Help others by providing structured, honest feedback about government offices.</p>
          </div>
          <div className="bg-ctp-mantle border border-ctp-surface1 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ctp-base border border-ctp-surface1 flex items-center justify-center text-ctp-sky-800">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-ctp-text uppercase tracking-widest">Verified Reports</p>
              <p className="text-[10px] text-ctp-subtext1 font-semibold uppercase tracking-tight">Structured & Moderated</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            
            <section className="bg-ctp-base rounded-2xl border border-ctp-surface1 p-6 md:p-10 space-y-10 shadow-sm">
              <div className="flex items-center gap-4 border-b border-ctp-surface1 pb-6">
                <div className="w-10 h-10 rounded-xl bg-ctp-sky-800 text-ctp-base flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ctp-text">Office Details</h2>
                  <p className="text-xs text-ctp-subtext1 font-semibold uppercase tracking-wider mt-0.5">Which branch did you visit?</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ctp-subtext1 uppercase tracking-wider ml-1">Government Agency</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ctp-subtext0" size={16} />
                    <select 
                      required
                      value={formData.agency}
                      onChange={(e) => setFormData({...formData, agency: e.target.value})}
                      className="w-full pl-11 pr-6 py-3 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-sm font-medium focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Agency</option>
                      <option value="DFA">DFA</option>
                      <option value="PSA">PSA</option>
                      <option value="NBI">NBI</option>
                      <option value="SSS">SSS</option>
                      <option value="LTO">LTO</option>
                      <option value="PhilHealth">PhilHealth</option>
                      <option value="PAG-IBIG">PAG-IBIG</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ctp-subtext1 uppercase tracking-wider ml-1">Branch Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-ctp-subtext0" size={16} />
                    <input 
                      required
                      type="text" 
                      minLength={3}
                      maxLength={100}
                      placeholder="e.g. SM Manila, Quezon City Hall"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="w-full pl-11 pr-6 py-3 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-sm font-medium focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all placeholder:text-ctp-subtext0/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ctp-subtext1 uppercase tracking-wider ml-1">Date of Visit</label>
                  <input 
                    required
                    type="date" 
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.dateVisited}
                    onChange={(e) => setFormData({...formData, dateVisited: e.target.value})}
                    className="w-full px-6 py-3 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-sm font-medium focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </section>

            <section className="bg-ctp-base rounded-2xl border border-ctp-surface1 p-6 md:p-10 space-y-10 shadow-sm">
              <div className="flex items-center gap-4 border-b border-ctp-surface1 pb-6">
                <div className="w-10 h-10 rounded-xl bg-ctp-yellow text-ctp-base flex items-center justify-center">
                  <Star size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ctp-text">Performance Ratings</h2>
                  <p className="text-xs text-ctp-subtext1 font-semibold uppercase tracking-wider mt-0.5">Rate based on your actual experience.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StarRating 
                  category="speed" 
                  label="Processing Speed" 
                  icon={Clock} 
                  value={formData.ratings.speed}
                  hoverValue={hoverRatings.speed}
                  onClick={handleRatingClick}
                  onHover={handleHoverRating}
                />
                <StarRating 
                  category="friendliness" 
                  label="Staff Friendliness" 
                  icon={Users} 
                  value={formData.ratings.friendliness}
                  hoverValue={hoverRatings.friendliness}
                  onClick={handleRatingClick}
                  onHover={handleHoverRating}
                />
                <StarRating 
                  category="management" 
                  label="Queue Management" 
                  icon={Users} 
                  value={formData.ratings.management}
                  hoverValue={hoverRatings.management}
                  onClick={handleRatingClick}
                  onHover={handleHoverRating}
                />
                <StarRating 
                  category="cleanliness" 
                  label="Facility Cleanliness" 
                  icon={Building2} 
                  value={formData.ratings.cleanliness}
                  hoverValue={hoverRatings.cleanliness}
                  onClick={handleRatingClick}
                  onHover={handleHoverRating}
                />
              </div>
            </section>

            <section className="bg-ctp-base rounded-2xl border border-ctp-surface1 p-6 md:p-10 space-y-10 shadow-sm">
              <div className="flex items-center gap-4 border-b border-ctp-surface1 pb-6">
                <div className="w-10 h-10 rounded-xl bg-ctp-peach text-ctp-base flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ctp-text">Specific Insights</h2>
                  <p className="text-xs text-ctp-subtext1 font-semibold uppercase tracking-wider mt-0.5">Helpful details for fellow applicants.</p>
                </div>
              </div>

              <div className="bg-ctp-mantle rounded-xl border border-ctp-surface1 p-6 shadow-sm">
                <RadioGroup 
                  label="Appointment Availability" 
                  name="appointment"
                  options={[
                    { label: 'Easy', value: 'easy' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'Difficult', value: 'difficult' }
                  ]}
                  value={formData.appointment}
                  onChange={(val) => setFormData({...formData, appointment: val})}
                  tooltip
                />
                <RadioGroup 
                  label="Actual Waiting Time" 
                  name="waitingTime"
                  options={[
                    { label: '< 1 Hour', value: 'fast' },
                    { label: '1–3 Hours', value: 'medium' },
                    { label: 'Whole Day', value: 'slow' }
                  ]}
                  value={formData.waitingTime}
                  onChange={(val) => setFormData({...formData, waitingTime: val})}
                  tooltip
                />
                <RadioGroup 
                  label="Extra requirements requested?" 
                  name="extraRequirements"
                  options={[
                    { label: 'No', value: 'no' },
                    { label: 'Yes', value: 'yes' }
                  ]}
                  value={formData.extraRequirements}
                  onChange={(val) => setFormData({...formData, extraRequirements: val})}
                  tooltip
                />
                <RadioGroup 
                  label="Fixer activity noticeable?" 
                  name="fixerActivity"
                  options={[
                    { label: 'No', value: 'no' },
                    { label: 'Yes', value: 'yes' }
                  ]}
                  value={formData.fixerActivity}
                  onChange={(val) => setFormData({...formData, fixerActivity: val})}
                  tooltip
                />
              </div>
            </section>

            <section className="bg-ctp-base rounded-2xl border border-ctp-surface1 p-6 md:p-10 space-y-8 shadow-sm">
              <div className="flex items-center gap-4 border-b border-ctp-surface1 pb-6">
                <div className="w-10 h-10 rounded-xl bg-ctp-mauve text-ctp-base flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ctp-text">Your Feedback</h2>
                  <p className="text-xs text-ctp-subtext1 font-semibold uppercase tracking-wider mt-0.5">Briefly share your thoughts (Optional).</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea 
                  rows="4" 
                  maxLength={500}
                  placeholder="Share a pro-tip or detail about your visit... (Max 500 chars)"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full px-6 py-4 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-base font-medium focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all resize-none"
                />
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-ctp-subtext0 px-2">
                  <span>Honest feedback only</span>
                  <span>{formData.comment.length}/500</span>
                </div>
              </div>
            </section>

          </div>

          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-ctp-sky-800 text-ctp-base rounded-2xl p-8 space-y-8 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ctp-base/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 space-y-1">
                <h3 className="text-xl font-bold uppercase tracking-tight">Guidelines</h3>
                <p className="text-ctp-base/80 text-sm font-semibold">Ensure your report is helpful.</p>
              </div>

              <div className="relative z-10 space-y-3">
                {[
                  { icon: Zap, text: "Keep it constructive" },
                  { icon: ShieldCheck, text: "Privacy-focused" },
                  { icon: HelpCircle, text: "Accurate details" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-ctp-base/10 p-4 rounded-xl border border-ctp-base/20">
                    <item.icon size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 pt-2 space-y-6">
                <div 
                  className="flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => setFormData({...formData, isAnonymous: !formData.isAnonymous})}
                >
                  <div className={`w-5 h-5 rounded border-2 border-ctp-base flex items-center justify-center transition-all ${formData.isAnonymous ? 'bg-ctp-base text-ctp-sky-800' : 'bg-transparent'}`}>
                    {formData.isAnonymous && <CheckCircle2 size={14} strokeWidth={4} />}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider">Submit as anonymous</span>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-ctp-base text-ctp-sky-800 py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm text-sm"
                >
                  {isSubmitting ? "Processing..." : "Publish Report"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="bg-ctp-mantle border border-ctp-surface1 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-2 text-ctp-peach">
                 <AlertCircle size={18} />
                 <h4 className="text-[11px] font-bold uppercase tracking-wider">Important Note</h4>
               </div>
               <p className="text-sm text-ctp-subtext1 font-medium leading-relaxed italic opacity-90">
                 Reports undergo moderation before appearing publicly. Please avoid including personal identifiable information (PII).
               </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
