import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onEdit, onDelete, onWorkToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { ...task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isWorking = task.status === 'working';
  const isFinished = task.status === 'finished';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        glass-panel p-4 mb-3 rounded-xl relative group
        ${isWorking ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,157,0.2)]' : 'border-white/5'}
        ${isFinished ? 'opacity-75' : ''}
        hover:border-neon-green/50 transition-all duration-300
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-neon-green"
      >
        ⋮⋮
      </div>

      <div className="pr-6">
        <h3 className="font-bold text-lg mb-1 text-gray-100 group-hover:text-neon-green transition-colors">
          {task.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isFinished ? 'bg-neon-blue' : 'bg-neon-green'
            }`}
          style={{ width: `${task.progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full border ${task.priority >= 80 ? 'border-red-500 text-red-400' :
            task.priority >= 50 ? 'border-yellow-500 text-yellow-400' :
              'border-gray-600 text-gray-400'
            }`}>
            P: {Math.round(task.priority)}
          </span>
          {task.dueDate && (
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>

        <div className="flex gap-2">
          {!isFinished && (
            <button
              onClick={() => onWorkToggle(task)}
              className={`px-3 py-1 rounded-md transition-colors ${isWorking
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse'
                : 'bg-neon-green/10 text-neon-green hover:bg-neon-green/20'
                }`}
            >
              {isWorking ? 'Stop' : 'Start'}
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-red-500/50 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
