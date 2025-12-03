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

    const CustomEvent = ({ event, view }) => {
        const isFinished = event.resource.status === 'finished';
        const isMonth = view === 'month';

        return (
            <div className={`w-full rounded-lg border-l-4 transition-all ${isFinished
                ? 'bg-blue-900/40 border-neon-blue'
                : 'bg-green-900/40 border-neon-green'
                } ${isMonth ? 'p-1 h-auto mb-1' : 'p-2 h-full'}`}>
                <div className={`font-bold text-gray-100 ${isMonth ? 'text-xs truncate' : 'text-sm'}`}>
                    {event.title}
                </div>
                {!isMonth && (
                    <div className="text-xs text-gray-400 mt-1">
                        {isFinished ? 'Completed' : 'In Progress'}
                    </div>
                )}
            </div>
        );
    };



    const [date, setDate] = React.useState(new Date());
    const [view, setView] = React.useState('day');

    const onNavigate = (newDate) => setDate(newDate);
    const onView = (newView) => setView(newView);

    return (
        <div className="h-[600px] p-4 glass-panel rounded-2xl flex flex-col relative z-10">
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
                    eventPropGetter={() => ({ style: { backgroundColor: 'transparent', border: 'none' } })}
                    components={{
                        event: (props) => <CustomEvent {...props} view={view} />
                    }}
                    views={['day']}
                    view={view}
                    date={date}
                    onNavigate={onNavigate}
                    onView={onView}
                    className="text-gray-300"
                    toolbar={true}
                />
            </div>
        </div>
    );
};

export default CalendarView;
