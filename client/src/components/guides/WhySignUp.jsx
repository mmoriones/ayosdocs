import { Clock, FileText, Bell, UserPlus } from 'lucide-react';

const WhySignUp = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">
        Why sign up?
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Save your progress</p>
            <p className="text-sm text-gray-500">
              Pick up where you left off
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Track your applications</p>
            <p className="text-sm text-gray-500">
              Stay updated every step of the way
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Get helpful reminders</p>
            <p className="text-sm text-gray-500">
              Never miss an important update
            </p>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition">
        <UserPlus className="w-4 h-4" />
        Create an Account
      </button>
    </div>
  );
};

export default WhySignUp;
