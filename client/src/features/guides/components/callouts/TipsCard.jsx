import { CheckCircle, FileText, AlertCircle, ExternalLink } from 'lucide-react';

const TipsCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">
        Before you proceed
      </h3>

      <div className="space-y-4">

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Double-check your details</p>
            <p className="text-sm text-gray-500">
              Make sure names and information match your IDs
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Prepare all requirements</p>
            <p className="text-sm text-gray-500">
              Bring valid IDs and extra photocopies
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Check office availability</p>
            <p className="text-sm text-gray-500">
              Confirm schedules and possible holidays
            </p>
          </div>
        </div>
      </div>

      {/* OPTIONAL CTA */}
      <button className="w-full flex items-center justify-center gap-2 
        border border-gray-200 text-gray-700 hover:bg-gray-50 
        font-medium py-2.5 rounded-lg transition text-sm">
        <ExternalLink className="w-4 h-4" />
        View official resources
      </button>
    </div>
  );
};

export default TipsCard;
