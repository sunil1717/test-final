// components/ConfirmDialog.jsx
import React, { createContext, useContext, useState } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({ message: '', resolve: null });

  const confirm = (message) =>
    new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });

  const handleConfirm = () => {
    confirmState.resolve(true);
    setConfirmState({ message: '', resolve: null });
  };

  const handleCancel = () => {
    confirmState.resolve(false);
    setConfirmState({ message: '', resolve: null });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {confirmState.resolve && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-md">
            <p className="text-gray-800 mb-6 text-center">{confirmState.message}</p>
            <div className="flex justify-center gap-5">
              <button
                onClick={handleCancel}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
