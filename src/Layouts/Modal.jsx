import React from "react";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 h-3/4 overflow-y-auto p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-600"
        >
          X
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
