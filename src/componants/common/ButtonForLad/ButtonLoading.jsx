// SubmitButton.js
import React from "react";

const SubmitButton = ({ onSubmit, loading, buttonText = "Submit" }) => {
  return (
    <button
      type="submit"
      onClick={onSubmit}
      disabled={loading}
      style={{ backgroundColor: "#2196F3" }}
      className="flex items-center justify-center text-white font-bold py-2 px-4 rounded focus:outline-none"
    >
      {loading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default SubmitButton;
