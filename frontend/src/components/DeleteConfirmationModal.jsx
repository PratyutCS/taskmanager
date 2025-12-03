import React, { useState } from 'react';

const DeleteConfirmationModal = ({ task, onClose, onConfirm }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6 animate-pulse-glow border border-red-500/30">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Delete Task?</h2>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete <span className="font-bold text-white">"{task.title}"</span>?
                    This action cannot be undone.
                </p>

                <div className="flex items-center gap-3 mb-6 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <input
                        type="checkbox"
                        id="confirm-delete"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                        className="w-5 h-5 accent-red-500 bg-dark-bg border-gray-700 rounded cursor-pointer"
                    />
                    <label htmlFor="confirm-delete" className="text-sm text-gray-200 cursor-pointer select-none">
                        I confirm that I want to delete this task permanently.
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(task)}
                        disabled={!isConfirmed}
                        className={`flex-1 py-3 rounded-lg font-bold transition-colors ${isConfirmed
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
