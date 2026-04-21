import React from 'react';
import ChecklistCard from '../features/guides/ChecklistCard';

const FullGuide = ({ title, lastUpdated, children, checklistSteps, guideName, slug }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 px-8 py-6 items-start animate-fadeIn transition-colors duration-300">
      
      {/* LEFT COLUMN: SEO Blog Content */}
      <div className="flex-1 w-full p-6 lg:p-10 rounded-2xl shadow-sm border 
        bg-white border-gray-100 
        dark:bg-[#242729] dark:border-gray-800">
        
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight 
            text-gray-900 dark:text-gray-100">
            STEP-BY-STEP GUIDE: {title}
          </h1>
          <p className="text-sm mt-2 font-medium text-gray-500 dark:text-gray-400">
            Last Updated: {lastUpdated}
          </p>
        </header>

        {/* Article content with Typography support */}
        <article className="prose prose-teal max-w-none leading-relaxed 
          text-gray-700 dark:text-gray-300 dark:prose-invert">
          {children}
        </article>

        {/* Bottom AdSense Placeholder */}
        <div className="mt-12 p-4 border border-dashed rounded-lg text-center text-xs 
          bg-gray-50 border-gray-300 text-gray-400
          dark:bg-[#1a1c1e] dark:border-gray-700 dark:text-gray-500">
          In-Article AdSense Placeholder
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky Sidebar */}
      <div className="w-full lg:w-96 space-y-6 sticky top-8">
        
        <ChecklistCard 
          title={guideName} 
          initialSteps={checklistSteps} 
          slug={slug}
          isFullPage={true}
          />

        {/* Sidebar Ads */}
        <div className="p-4 border rounded-xl shadow-sm bg-white dark:bg-[#242729] dark:border-gray-800">
          <p className="text-[10px] mb-2 text-center uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
            Sponsored Ads
          </p>
          <div className="space-y-4">
            <div className="h-64 w-full border border-dashed rounded flex items-center justify-center text-xs
              bg-gray-100 border-gray-200 text-gray-400
              dark:bg-[#1a1c1e] dark:border-gray-800 dark:text-gray-500">
              [ADSENSE PLACEHOLDER]
            </div>
            <div className="h-64 w-full border border-dashed rounded flex items-center justify-center text-xs
              bg-gray-100 border-gray-200 text-gray-400
              dark:bg-[#1a1c1e] dark:border-gray-800 dark:text-gray-500">
              [ADSENSE PLACEHOLDER]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullGuide;