import ChecklistCard from './ChecklistCard';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuidePageLayout = ({
  title,
  lastUpdated,
  children,
  checklistSteps,
  guideName,
  slug
}) => {
  return (
    <div className="px-6 lg:px-10 py-6 space-y-6">

      {/* BACK BUTTON */}
      <Link
        to="/my-progress"
        className="inline-flex items-center gap-2 text-sm text-teal-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to My Progress
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6">

          {/* HEADER CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                IN PROGRESS
              </span>

              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
                Step-by-Step Guide: {title}
              </h1>

              <p className="text-sm text-gray-500">
                Last Updated: {lastUpdated}
              </p>
            </div>

          </div>

          {/* CONTENT + TOC */}
          <div className="flex gap-8">

            {children}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-96 space-y-6 sticky top-8">
          <ChecklistCard
            title={guideName}
            initialSteps={checklistSteps}
            slug={slug}
            isFullPage={true}
          />

          {/* OPTIONAL: Help Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Need help?</p>
              <p className="text-sm text-gray-500">
                Check our resources or FAQs
              </p>
            </div>
            <span className="text-gray-400">→</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GuidePageLayout;
