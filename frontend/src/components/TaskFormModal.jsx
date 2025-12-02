import React, { useState, useEffect } from 'react';

const TaskFormModal = ({ task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        estimatedTime: '',
        priority: 0,
        dueDate: '',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                estimatedTime: task.estimatedTime || '',
                priority: task.priority || 0,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            _id: task?._id, // Include ID if editing
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-lg rounded-2xl p-6 animate-pulse-glow">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {task ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                            placeholder="Task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-neon-green focus:outline-none transition-colors h-24 resize-none"
                            placeholder="Task details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Est. Time (mins)</label>
                            <input
                                name="estimatedTime"
                                type="number"
                                min="0"
                                value={formData.estimatedTime}
                                onChange={handleChange}
                                className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                            <input
                                name="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Initial Priority (0-100)</label>
                        <input
                            name="priority"
                            type="range"
                            min="0"
                            max="100"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full accent-neon-green"
                        />
                        <div className="text-right text-neon-green font-mono">{formData.priority}</div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-lg bg-neon-green text-dark-bg font-bold hover:bg-neon-green-dim transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                        >
                            {task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;
