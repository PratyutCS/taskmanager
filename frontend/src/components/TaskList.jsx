import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ title, tasks, onSetWorking, onLogWork, SortableTaskCardComponent }) => {
  const CardComponent = SortableTaskCardComponent || TaskCard;
  return (
    <div className="bg-dark-night/30 p-4 rounded-xl w-full md:w-1/3">
      <h2 className="text-xl font-bold text-center mb-4 text-neon-emerald tracking-wide">{title}</h2>
      <div className="space-y-4">
        {tasks && tasks.map(task => (
          <CardComponent key={task._id} task={task} onSetWorking={onSetWorking} onLogWork={onLogWork} />
        ))}
        {!tasks || tasks.length === 0 && (
            <p className='text-center text-secondary-text'>No tasks in this list.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
