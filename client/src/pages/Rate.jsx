import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  Users, 
  Clock, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Info, 
  MessageSquare,
  Lock,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import personImg from '../assets/person2.webp';

/**
 * Rate Page Component
 * Allows users to share their experiences and rate government offices.
 */
const Rate = () => {
  const { user, openAuthModal } = useAuth();
  const [formData, setFormData] = useState({
    agency: '',
    region: '',
    province: '',
    city: '',
    office: '',
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
    feedback: ''
  });

  const [hoverRatings, setHoverRatings] = useState({
    speed: 0,
    friendliness: 0,
    management: 0,
    cleanliness: 0
  });

  useEffect(() => {
    document.title = "Share Your Experience | AyosDocs";
    window.scrollTo(0, 0);
  }, []);

  const handleRatingClick = (category, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value }
    }));
  };

  const handleHoverRating = (category, value) => {
    setHoverRatings(prev => ({ ...prev, [category]: value }));
  };

  const StarRating = ({ category, label, icon: Icon }) => {
    return (
      <div className="bg-ctp-mantle border border-ctp-surface0 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-2xl bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 mb-4">
          <Icon size={24} />
        </div>
        <h4 className="text-sm font-bold text-ctp-text mb-4">{label}</h4>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(category, star)}
              onMouseEnter={() => handleHoverRating(category, star)}
              onMouseLeave={() => handleHoverRating(category, 0)}
              className="transition-transform active:scale-90"
            >
              <Star
                size={22}
                className={`${
                  star <= (hoverRatings[category] || formData.ratings[category])
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

  const RadioGroup = ({ label, name, options, value, onChange, tooltip }) => (
    <div className="py-6 border-b border-ctp-surface0 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-ctp-text">{label}</label>
        {tooltip && <Info size={14} className="text-ctp-subtext0 cursor-help" />}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="peer appearance-none w-5 h-5 rounded-full border-2 border-ctp-surface0 checked:border-ctp-sky-800 transition-all cursor-pointer bg-ctp-base"
              />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-ctp-sky-800 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className={`text-sm font-medium transition-colors ${value === option.value ? 'text-ctp-text' : 'text-ctp-subtext1 group-hover:text-ctp-text'}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        
        {/* Navigation */}
        <Link 
          to="/guides" 
          className="inline-flex items-center gap-2 text-ctp-sky-800 font-bold text-xs hover:gap-3 transition-all mb-6"
        >
          <ArrowLeft size={14} />
          Back to All Guides
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Rating Actions - Left Column */}
          <div className="flex-1 space-y-12">
            
            {/* Header */}
            <header>
              <h1 className="text-2xl md:text-3xl font-extrabold text-ctp-text tracking-tight mb-2">
                Share your experience
              </h1>
              <p className="text-ctp-subtext0 text-sm md:text-base">
                Help others by rating your experience at a government office.
              </p>
            </header>

            {/* Info Banner */}
            <div className="bg-ctp-sky-800/5 border border-ctp-sky-800/10 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-ctp-mantle border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ctp-text uppercase tracking-tight">Your feedback is anonymous and helps improve public services.</h4>
                <p className="text-xs text-ctp-subtext0 mt-0.5">Please provide accurate and honest information.</p>
              </div>
            </div>

            {/* Step 1: Select Office */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center text-xs font-black">1</div>
                <h2 className="text-lg font-bold text-ctp-text">Select the government office</h2>
              </div>
              <p className="text-xs text-ctp-subtext0 pl-10">Choose the office where you availed the service.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pl-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest pl-0.5">Agency</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-ctp-base border border-ctp-surface0 rounded-xl px-3.5 py-2.5 pr-10 text-ctp-subtext1 focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-xs font-medium cursor-pointer">
                      <option>Select agency</option>
                      <option>DFA</option>
                      <option>PSA</option>
                      <option>NBI</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest pl-0.5">Region</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-ctp-base border border-ctp-surface0 rounded-xl px-3.5 py-2.5 pr-10 text-ctp-subtext1 focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-xs font-medium cursor-pointer">
                      <option>Select region</option>
                      <option>NCR</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest pl-0.5">Province</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-ctp-base border border-ctp-surface0 rounded-xl px-3.5 py-2.5 pr-10 text-ctp-subtext1 focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-xs font-medium cursor-pointer">
                      <option>Select province</option>
                      <option>Metro Manila</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest pl-0.5">City / Municipality</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-ctp-base border border-ctp-surface0 rounded-xl px-3.5 py-2.5 pr-10 text-ctp-subtext1 focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-xs font-medium cursor-pointer">
                      <option>Select city or municipality</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-widest pl-0.5">Office / Branch</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-ctp-base border border-ctp-surface0 rounded-xl px-3.5 py-2.5 pr-10 text-ctp-subtext1 focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all text-xs font-medium cursor-pointer">
                      <option>Select office or branch</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Rate Experience */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center text-xs font-black">2</div>
                <h2 className="text-lg font-bold text-ctp-text">Rate your experience</h2>
              </div>
              <p className="text-xs text-ctp-subtext0 pl-10">Rate the following aspects of your visit.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-10">
                <StarRating category="speed" label="Processing Speed" icon={Clock} />
                <StarRating category="friendliness" label="Staff Friendliness" icon={Users} />
                <StarRating category="management" label="Queue Management" icon={Users} />
                <StarRating category="cleanliness" label="Facility Cleanliness" icon={Building2} />
              </div>
            </section>

            {/* Step 3: Answer Questions */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center text-xs font-black">3</div>
                <h2 className="text-lg font-bold text-ctp-text">Answer a few questions</h2>
              </div>
              <p className="text-xs text-ctp-subtext0 pl-10">Your answers will help others prepare better.</p>
              
              <div className="pl-10 bg-ctp-mantle rounded-3xl border border-ctp-surface0 p-6 px-8 shadow-sm">
                <RadioGroup 
                  label="Appointment Availability" 
                  name="appointment"
                  options={[
                    { label: 'Easy', value: 'easy' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'Difficult', value: 'difficult' }
                  ]}
                  value={formData.appointment}
                  onChange={(val) => setFormData(prev => ({ ...prev, appointment: val }))}
                  tooltip
                />
                <RadioGroup 
                  label="Actual Waiting Time" 
                  name="waitingTime"
                  options={[
                    { label: 'Less than 1 hour', value: 'under1' },
                    { label: '1-3 hours', value: '1to3' },
                    { label: 'Whole day', value: 'allday' }
                  ]}
                  value={formData.waitingTime}
                  onChange={(val) => setFormData(prev => ({ ...prev, waitingTime: val }))}
                  tooltip
                />
                <RadioGroup 
                  label="Extra requirements requested?" 
                  name="extraRequirements"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                  ]}
                  value={formData.extraRequirements}
                  onChange={(val) => setFormData(prev => ({ ...prev, extraRequirements: val }))}
                  tooltip
                />
                <RadioGroup 
                  label="Fixer/scalper activity noticeable?" 
                  name="fixerActivity"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                  ]}
                  value={formData.fixerActivity}
                  onChange={(val) => setFormData(prev => ({ ...prev, fixerActivity: val }))}
                  tooltip
                />
              </div>
            </section>

            {/* Step 4: Additional Feedback */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center text-xs font-black">4</div>
                <h2 className="text-lg font-bold text-ctp-text">Additional feedback (optional)</h2>
              </div>
              <p className="text-xs text-ctp-subtext0 pl-10">Share any additional details that may help others. Keep it short and helpful.</p>
              
              <div className="pl-10 space-y-4">
                <div className="relative">
                  <textarea 
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Write your feedback here..."
                    maxLength={500}
                    className="w-full min-h-[140px] bg-ctp-base border border-ctp-surface0 rounded-2xl p-5 text-xs text-ctp-text placeholder:text-ctp-subtext0 focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all resize-none shadow-sm"
                  />
                  <div className="absolute bottom-5 right-5 text-[9px] font-bold text-ctp-subtext0 uppercase tracking-widest">
                    {formData.feedback.length} / 500 characters
                  </div>
                </div>

                <div className="bg-ctp-mantle border border-ctp-surface0 rounded-xl p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-subtext0 shrink-0">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-ctp-text uppercase tracking-tight">Keep it respectful and helpful.</h4>
                    <p className="text-[11px] text-ctp-subtext0 mt-0.5">We remove reports with offensive language or misleading information.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Submission Guard */}
            <div className="pl-10 pt-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-ctp-mantle rounded-xl border border-ctp-surface0">
                <div className="flex items-center gap-2 text-ctp-subtext0">
                  <Lock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Login required to submit</span>
                </div>
                {user ? (
                  <button className="w-full sm:w-auto px-8 py-2.5 bg-ctp-sky-800 text-ctp-base rounded-full font-bold text-xs hover:bg-ctp-sky-800/90 transition-all shadow-md shadow-ctp-sky-800/20 active:scale-95">
                    Submit Experience
                  </button>
                ) : (
                  <button 
                    onClick={openAuthModal}
                    className="w-full sm:w-auto px-8 py-2.5 bg-ctp-sky-800 text-ctp-base rounded-full font-bold text-xs hover:bg-ctp-sky-800/90 transition-all shadow-md shadow-ctp-sky-800/20 active:scale-95"
                  >
                    Log in to submit
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar - Right Column */}
          <aside className="w-full lg:w-[380px] shrink-0 space-y-8">
            
            {/* Why Feedback Matters */}
            <section className="bg-ctp-mantle rounded-3xl p-6 border border-ctp-surface0 shadow-sm relative overflow-hidden group">
              <h3 className="text-base font-bold text-ctp-text mb-6 relative z-10">Why your feedback matters</h3>
              
              <div className="relative mb-6 flex justify-center">
                <div className="absolute inset-0 bg-ctp-sky-800/5 rounded-full scale-150 blur-3xl opacity-50" />
                <img src={personImg} alt="" className="h-36 w-auto object-contain relative z-10 transition-transform group-hover:scale-105 duration-500" />
              </div>

              <div className="space-y-5 relative z-10">
                {[
                  { text: "Helps others set expectations and plan their visit" },
                  { text: "Encourages offices to improve their services" },
                  { text: "Promotes transparency and accountability" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-ctp-sky-800/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-ctp-sky-800" />
                    </div>
                    <p className="text-xs text-ctp-subtext1 font-medium leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips for a great report */}
            <section className="bg-ctp-mantle rounded-3xl p-6 border border-ctp-surface0 shadow-sm">
              <h3 className="text-base font-bold text-ctp-text mb-6">Tips for a great report</h3>
              <div className="space-y-6">
                {[
                  { title: "Be accurate and specific", text: "Share what you experienced during your visit.", icon: CheckCircle2 },
                  { title: "Focus on facts", text: "Avoid personal opinions or political statements.", icon: CheckCircle2 },
                  { title: "Keep it short and concise", text: "300-500 characters is ideal for helpful reports.", icon: CheckCircle2 }
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-ctp-base flex items-center justify-center text-ctp-subtext0 shrink-0">
                      <tip.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ctp-text">{tip.title}</h4>
                      <p className="text-xs text-ctp-subtext0 mt-0.5 leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What happens next? */}
            <section className="bg-ctp-mantle rounded-3xl p-6 border border-ctp-surface0 shadow-sm">
              <h3 className="text-base font-bold text-ctp-sky-800 mb-6">What happens next?</h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "You submit your report", text: "Your feedback is anonymous and securely submitted." },
                  { step: 2, title: "We review your report", text: "Our team checks for accuracy and policy compliance." },
                  { step: 3, title: "It becomes part of insights", text: "Your report helps build better community insights." }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-ctp-sky-800 text-ctp-base flex items-center justify-center text-[10px] font-black shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ctp-text">{step.title}</h4>
                      <p className="text-[11px] text-ctp-subtext1 mt-0.5 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 flex items-start gap-3">
                  <div className="text-ctp-sky-800 shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="text-[10px] text-ctp-subtext0 font-medium leading-relaxed uppercase tracking-tighter">All reports are moderated to ensure quality and safety.</p>
                </div>
              </div>
            </section>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default Rate;
