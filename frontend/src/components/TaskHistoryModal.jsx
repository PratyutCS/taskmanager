import React, { useState, useEffect } from 'react';

const TaskHistoryModal = ({ task, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/worklog/${task._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (task) {
            fetchLogs();
        }
    }, [task]);

    const totalTime = logs.reduce((acc, log) => acc + log.timeSpent, 0);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 animate-pulse-glow max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{task.title}</h2>
                        <p className="text-gray-400 text-sm">History & Work Logs</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="bg-dark-surface p-3 rounded-lg border border-gray-700 flex-1">
                        <div className="text-xs text-gray-500 uppercase">Total Time</div>
                        <div className="text-xl font-bold text-neon-green">{totalTime} mins</div>
                    </div>
                    <div className="bg-dark-surface p-3 rounded-lg border border-gray-700 flex-1">
                        <div className="text-xs text-gray-500 uppercase">Status</div>
                        <div className="text-xl font-bold text-neon-blue capitalize">{task.status}</div>
                    </div>
                    <div className="bg-dark-surface p-3 rounded-lg border border-gray-700 flex-1">
                        <div className="text-xs text-gray-500 uppercase">Created</div>
                        <div className="text-sm font-bold text-gray-300">{new Date(task.createdDate).toLocaleDateString()}</div>
                    </div>
                </div>

                {task.description && (
                    <div className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                        <h4 className="text-sm font-bold text-neon-blue mb-2">Description</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{task.description}</p>
                    </div>
                )}

                <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Work Logs</h4>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading logs...</p>
                    ) : logs.length === 0 ? (
                        <p className="text-center text-gray-500">No work logs found.</p>
                    ) : (
                        logs.map((log) => (
                            <div key={log._id} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-neon-green/30 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-neon-green font-bold text-lg">{log.timeSpent}m</span>
                                        <span className="text-gray-600 text-xs">|</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(log.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                </div>
                                {log.notes ? (
                                    <div className="bg-black/20 p-3 rounded border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Work Done:</p>
                                        <p className="text-gray-200 text-sm whitespace-pre-wrap">{log.notes}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-xs italic">No notes recorded.</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskHistoryModal;
