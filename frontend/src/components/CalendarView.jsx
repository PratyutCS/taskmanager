import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({ tasks }) => {
    const [viewMode, setViewMode] = React.useState('pending'); // 'pending' or 'finished'

    const events = tasks
        .filter(task => {
            if (viewMode === 'pending') return task.status !== 'finished' && task.createdDate;
            if (viewMode === 'finished') return task.status === 'finished' && task.lastProgressUpdate;
            return false;
        })
        .map(task => {
            let start, end;

            if (viewMode === 'pending') {
                start = new Date(task.createdDate);
                end = new Date(task.dueDate || task.createdDate);
                if (end < start) end = start;
            } else {
                // Finished mode: Show on the day it was finished
                start = new Date(task.lastProgressUpdate);
                end = new Date(task.lastProgressUpdate);
            }

            return {
                id: task._id,
                title: task.title,
                start,
                end,
                allDay: true,
                resource: task,
            };
        });

    const eventStyleGetter = (event) => {
        const isFinished = event.resource.status === 'finished';
        const isWorking = event.resource.status === 'working';

        let backgroundColor = '#1a2620';
        let borderColor = '#374151';

        if (isFinished) {
            backgroundColor = '#1e3a8a'; // Dark blue
            borderColor = '#00f3ff';
        } else if (isWorking) {
            backgroundColor = '#064e3b'; // Dark green
            borderColor = '#00ff9d';
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                color: '#e0e0e0',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '4px',
                fontSize: '0.8rem',
            }
        };
    };

    return (
        <div className="h-[600px] p-4 glass-panel rounded-2xl flex flex-col">
            <div className="flex justify-end mb-4 gap-2">
                <button
                    onClick={() => setViewMode('pending')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${viewMode === 'pending' ? 'bg-neon-green text-dark-bg font-bold' : 'text-gray-400 hover:text-white border border-gray-700'}`}
                >
                    Pending Tasks
                </button>
                <button
                    onClick={() => setViewMode('finished')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${viewMode === 'finished' ? 'bg-neon-blue text-dark-bg font-bold' : 'text-gray-400 hover:text-white border border-gray-700'}`}
                >
                    Finished Tasks
                </button>
            </div>

            <div className="flex-1">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    className="text-gray-300"
                />
            </div>
        </div>
    );
};

export default CalendarView;
