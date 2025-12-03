import React from 'react';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = React.useState(task ? task.title : '');
  const [description, setDescription] = React.useState(task ? task.description : '');
  const [dueDate, setDueDate] = React.useState(task ? task.dueDate : '');
  const [estimatedTime, setEstimatedTime] = React.useState(task ? task.estimatedTime : '');
  const [priority, setPriority] = React.useState(task ? task.priority : 50);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, dueDate, estimatedTime, priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-neon-emerald/50 rounded-xl p-8 w-full max-w-md shadow-neon-emerald/20 shadow-lg">
        <h2 className="text-2xl font-bold text-neon-emerald mb-6">{task ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 text-primary-text p-3 rounded-lg border-2 border-gray-700 focus:border-neon-emerald focus:outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 text-primary-text p-3 rounded-lg border-2 border-gray-700 focus:border-neon-emerald focus:outline-none h-24"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Due Date"
                value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-800 text-primary-text p-3 rounded-lg border-2 border-gray-700 focus:border-neon-emerald focus:outline-none"
              />
              <input
                type="number"
                placeholder="Est. Time (mins)"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full bg-gray-800 text-primary-text p-3 rounded-lg border-2 border-gray-700 focus:border-neon-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-secondary-text mb-2">Priority: {priority}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 text-secondary-text hover:text-primary-text transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-neon-emerald text-dark-night font-bold rounded-lg hover:bg-light-emerald transition shadow-md hover:shadow-neon-emerald/40">
              {task ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
