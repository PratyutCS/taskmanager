import React, { useState } from 'react';

const WorkLogModal = ({ task, onClose, onSave }) => {
  const [timeSpent, setTimeSpent] = useState('');
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(task.progress);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      taskId: task._id,
      timeSpent: parseInt(timeSpent),
      notes,
      progress: parseInt(progress),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 animate-pulse-glow">
        <h2 className="text-2xl font-bold text-white mb-1">Log Work</h2>
        <p className="text-neon-green text-sm mb-6">{task.title}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Time Spent (minutes)</label>
            <input
              type="number"
              required
              min="1"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-neon-green focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Progress (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full accent-neon-green"
            />
            <div className="text-right text-neon-green font-mono">{progress}%</div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-neon-green focus:outline-none transition-colors h-24 resize-none"
              placeholder="What did you work on?"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-neon-green text-dark-bg font-bold hover:bg-neon-green-dim transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)]"
            >
              Save Log
            </button>
            <button
              type="button"
              onClick={(e) => {
                setProgress(100);
                // We need to submit the form, but state update might not be immediate for the submit handler if we just called setProgress.
                // So we call onSave directly with 100.
                e.preventDefault();
                onSave({
                  taskId: task._id,
                  timeSpent: parseInt(timeSpent) || 0, // Default to 0 if empty, or validate? Requirement says "add time/work entries".
                  notes,
                  progress: 100,
                });
              }}
              className="flex-1 py-3 rounded-lg bg-neon-blue text-dark-bg font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              Complete Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkLogModal;
