import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, onTaskMove, onTaskEdit, onTaskDelete, onWorkToggle, onTaskHistory, onResetTimer }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('all'); // all, high, medium, low
    const [sortBy, setSortBy] = useState('order'); // order, priority, dueDate
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex((t) => t._id === active.id);
            const newIndex = tasks.findIndex((t) => t._id === over.id);

            const newOrder = arrayMove(tasks, oldIndex, newIndex);
            onTaskMove(newOrder);
        }

        setActiveId(null);
    };

    const activeTask = tasks.find((t) => t._id === activeId);

    // Filtering and Sorting Logic
    const processTasks = (taskList) => {
        return taskList
            .filter(t => {
                const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

                let matchesPriority = true;
                if (filterPriority === 'high') matchesPriority = t.priority >= 80;
                else if (filterPriority === 'medium') matchesPriority = t.priority >= 50 && t.priority < 80;
                else if (filterPriority === 'low') matchesPriority = t.priority < 50;

                return matchesSearch && matchesPriority;
            })
            .sort((a, b) => {
                if (sortBy === 'priority') return b.priority - a.priority;
                if (sortBy === 'dueDate') return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
                return a.order - b.order; // Default to manual order
            });
    };

    const activeTasks = processTasks(tasks.filter(t => t.status !== 'finished'));
    const finishedTasks = processTasks(tasks.filter(t => t.status === 'finished'));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                    <h2 className="text-xl font-bold text-neon-green neon-text">Active Tasks</h2>

                    <div className="flex flex-wrap gap-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-dark-surface border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-neon-green outline-none w-full sm:w-auto"
                        />

                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-dark-surface border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-neon-green outline-none"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-dark-surface border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-neon-green outline-none"
                        >
                            <option value="order">Manual Order</option>
                            <option value="priority">Highest Priority</option>
                            <option value="dueDate">Due Date</option>
                        </select>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={activeTasks.map(t => t._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3 pb-20">
                            {activeTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={onTaskEdit}
                                    onDelete={onTaskDelete}
                                    onWorkToggle={onWorkToggle}
                                    onResetTimer={onResetTimer}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId && activeTask ? (
                            <TaskCard task={activeTask} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <div className="glass-panel rounded-2xl p-6 h-fit max-h-full overflow-y-auto">
                <h2 className="text-xl font-bold text-neon-blue neon-text mb-4">Finished</h2>
                <div className="space-y-3">
                    {finishedTasks.map((task) => (
                        <div
                            key={task._id}
                            onClick={() => onTaskHistory(task)}
                            className="p-3 rounded-lg bg-white/5 border border-white/5 opacity-75 hover:opacity-100 hover:border-neon-blue/50 cursor-pointer transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium text-gray-300 line-through">{task.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Completed: {new Date(task.lastProgressUpdate).toLocaleDateString()}
                                    </p>
                                    <div className="mt-2 text-xs text-neon-blue">Click to view details</div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTaskDelete(task);
                                    }}
                                    className="text-red-500/50 hover:text-red-500 p-1"
                                    title="Delete Task"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                    {finishedTasks.length === 0 && (
                        <p className="text-gray-600 text-center py-4">No finished tasks yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskBoard;
