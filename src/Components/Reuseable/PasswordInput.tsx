import { memo } from "react";

// Props interface for type safety
interface PasswordInputProps {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  error?: string; // Optional error message for validation
}

// Reusable PasswordInput component with toggleable visibility
const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  error,
}) => {
  return (
    // Flex container for label, input, and error message
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {/* Password Input Field with ARIA attributes */}
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`p-3 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
        />
        {/* Password Visibility Toggle Button */}
        <button
          type="button"
          onClick={toggleShowPassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:opacity-70"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2" />
          </svg>
        </button>
      </div>
      {/* Error Message */}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default memo(PasswordInput); // Memoize to prevent unnecessary re-renders
