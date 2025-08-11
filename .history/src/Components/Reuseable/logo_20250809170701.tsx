import React, { memo } from 'react';

// Logo component for consistent branding across the HR-WEBAPP
const Logo: React.FC = () => {
  return (
    // Flex container for logo icon and text, with ARIA label for accessibility
    <div className="flex items-center gap-2" aria-label="Group5 HR logo">
      {/* SVG Logo Icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="#5B5CE6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="#5B5CE6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="#5B5CE6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Logo Text */}
      <span className="text-xl font-semibold text-gray-900">Group5</span>
    </div>
  );
};

export default memo(Logo); // Memoize to prevent unnecessary re-renders