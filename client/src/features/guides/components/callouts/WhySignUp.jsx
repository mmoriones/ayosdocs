import { CheckCircle, UserPlus } from 'lucide-react';
import person2 from '../../../../assets/person2.webp';

const WhySignUp = ({ onSignUp }) => {
  return (
    <div className="bg-[#F0F9F6] rounded-3xl p-6 relative overflow-hidden h-[320px] lg:h-auto lg:min-h-0 flex flex-col border border-teal-100/50 shadow-sm transition-all group">
      
      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full flex-1">
        
        {/* TEXT CONTENT */}
        <div className="max-w-[200px]">
          <h3 className="text-[11px] font-bold text-teal-700/60 uppercase tracking-widest leading-none mb-6">
            Better Experience
          </h3>
          
          <h4 className="text-[17px] font-extrabold text-gray-900 leading-tight mb-5">
            Create an account to track your progress
          </h4>

          <ul className="space-y-3 mb-8">
            {[
              "Save and track progress",
              "Get reminders and updates",
              "Access guides anywhere"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-teal-600 shrink-0" strokeWidth={3} />
                <span className="text-[11px] font-bold text-gray-600">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA BUTTON */}
        <div className="mt-auto max-w-[200px]">
          <button 
            onClick={onSignUp}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-teal-100/50 flex items-center justify-center gap-2 active:scale-95 text-[12px] uppercase tracking-wider"
          >
            <span>Sign up free</span>
            <UserPlus size={16} strokeWidth={2.5} />
          </button>

          <p className="mt-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">
            Already have an account? <button onClick={onSignUp} className="text-teal-600 hover:underline">Log in</button>
          </p>
        </div>
      </div>

      {/* ILLUSTRATION */}
      <div className="absolute -right-10 lg:-right-14 bottom-0 w-36 sm:w-52 lg:w-60 pointer-events-none z-0">
        <img 
          src={person2} 
          alt="Person with phone" 
          className="w-full h-full object-contain object-right-bottom scale-105 group-hover:scale-110 transition-transform duration-700 drop-shadow-sm"
        />
      </div>


      {/* BACKGROUND DECO */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100/50 rounded-full blur-2xl -mr-12 -mt-12" />
    </div>
  );
};

export default WhySignUp;
