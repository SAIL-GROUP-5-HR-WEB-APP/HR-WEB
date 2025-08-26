import { memo } from "react";

// Props interface for type safety
interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

// Reusable SocialButton component for social login buttons
const SocialButton: React.FC<SocialButtonProps> = ({ icon, text, onClick }) => {
  return (
    // Button with flex layout, ARIA label for accessibility
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sign up with ${text}`}
      className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-sm transition"
    >
      {icon}
      {text}
    </button>
  );
};

export default memo(SocialButton); // Memoize to prevent unnecessary re-renders
