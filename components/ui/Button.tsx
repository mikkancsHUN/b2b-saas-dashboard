import React from "react";

// Extend native button attributes to inherit standard HTML behaviors (e.g., type, onClick)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean; // Toggles loading state spinner and disables user interaction
  variant?: "primary" | "secondary" | "danger"; // Style variants mapping to product design requirements
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  // Base utility configurations for structural normalization and transition lifecycles
  const baseStyles =
    "w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  // Variant mappings aligning with application branding definitions
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-750 border border-gray-200 focus:ring-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-250 dark:border-gray-700 dark:focus:ring-gray-750",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Inline style injection providing predictable keyframe tracking across rendering environments */}
      {isLoading && (
        <>
          <style>{`
            @keyframes button-canvas-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .force-spin-icon {
              animation: button-canvas-spin 0.8s linear infinite !important;
            }
          `}</style>
          <svg
            className="h-4 w-4 text-current force-spin-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            {/* Background tracking arc */}
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            {/* Foreground high-contrast indicator arc */}
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </>
      )}

      <span>{children}</span>
    </button>
  );
};
