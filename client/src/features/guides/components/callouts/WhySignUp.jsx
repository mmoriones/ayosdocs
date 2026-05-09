import { CheckCircle, UserPlus } from 'lucide-react';
import person2 from '../../../../assets/person2.webp';

const WhySignUp = ({ onSignUp }) => {
  return (
    <div className="bg-[#F0F9F6] rounded-[32px] p-8 relative overflow-hidden h-[320px] lg:h-auto lg:min-h-0 flex flex-col">
      
      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full flex-1">
        
        {/* TEXT CONTENT */}
        <div className="max-w-[180px]">
          <h3 className="text-[17px] font-extrabold text-slate-900 leading-tight mb-4">
            Create an account for a better experience
          </h3>

          <ul className="space-y-2.5 mb-8">
            {[
              "Save and track your progress",
              "Get reminders and updates",
              "Access your guides anywhere"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-teal-600 shrink-0" strokeWidth={3} />
                <span className="text-[11px] font-bold text-slate-600">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA BUTTON */}
        <div className="mt-auto max-w-[180px]">
          <button 
            onClick={onSignUp}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-teal-100 flex items-center justify-center gap-2 active:scale-95 text-[13px]"
          >
            <span>Sign up for free</span>
            <UserPlus size={16} strokeWidth={2.5} />
          </button>

          <p className="mt-4 text-center text-[11px] font-bold text-slate-500">
            Already have an account? <button onClick={onSignUp} className="text-teal-600 hover:underline">Log in</button>
          </p>
        </div>
      </div>

      {/* ILLUSTRATION */}
      <div className="absolute -right-6 lg:-right-20 bottom-0 w-40 sm:w-64 lg:w-[300px] pointer-events-none z-0">
        <img 
          src={person2} 
          alt="Person with phone" 
          className="w-full h-full object-contain object-right-bottom scale-110"
        />
      </div>


      {/* BACKGROUND DECO */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/50 rounded-full blur-2xl -mr-12 -mt-12" />
    </div>
  );
};

export default WhySignUp;
