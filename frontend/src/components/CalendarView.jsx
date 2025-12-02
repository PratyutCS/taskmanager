import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({ tasks }) => {
    // Filter out finished tasks as requested
    const activeTasks = tasks.filter(task => task.status !== 'finished');

    const events = activeTasks.map(task => ({
        id: task._id,
        title: task.title,
        start: new Date(task.createdDate),
        end: new Date(task.dueDate || task.createdDate), // Use due date or created date for end
        allDay: true,
        resource: task,
    }));

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
        <div className="h-[600px] p-4 glass-panel rounded-2xl">
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
    );
};

export default CalendarView;
