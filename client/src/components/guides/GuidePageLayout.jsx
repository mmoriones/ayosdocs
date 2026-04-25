import React from 'react';
import ChecklistCard from './ChecklistCard';

const GuidePageLayout = ({ title, lastUpdated, children, checklistSteps, guideName, slug }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 px-8 py-6 items-start animate-fadeIn transition-colors duration-300">
      
      {/* LEFT COLUMN: SEO Blog Content */}
      <div className="flex-1 w-full p-6 lg:p-10 rounded-2xl shadow-sm border 
        bg-white border-gray-100">
        
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-900">
            STEP-BY-STEP GUIDE: {title}
          </h1>
          <p className="text-sm mt-2 font-medium text-gray-500">
            Last Updated: {lastUpdated}
          </p>
        </header>

        {/* Article content with Typography support */}
        <article className="prose prose-teal max-w-none leading-relaxed 
          text-gray-700">
          {children}
        </article>

        {/* AdSense  */}

      </div>

      {/* RIGHT COLUMN: Sticky Sidebar */}
      <div className="w-full lg:w-96 space-y-6 sticky top-8">
        
        <ChecklistCard 
          title={guideName} 
          initialSteps={checklistSteps} 
          slug={slug}
          isFullPage={true}
          />
      </div>
    </div>
  );
};

export default GuidePageLayout;