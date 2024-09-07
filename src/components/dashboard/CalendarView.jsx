import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameMonth, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CalendarView = ({ tasks, currentDate, setCurrentDate, calendarView }) => {
  const getDateRange = () => {
    if (calendarView === 'week') {
      return {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate)
      };
    } else {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      };
    }
  };

  const { start, end } = getDateRange();
  const days = eachDayOfInterval({ start, end });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      return taskDate && taskDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevious = () => {
    if (calendarView === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (calendarView === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(start, 'MMM dd, yyyy')} - {format(end, 'MMM dd, yyyy')}
        </h2>
        <Button onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className={`grid ${calendarView === 'week' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
        {days.map((day, index) => (
          <div
            key={index}
            className={`border rounded-lg p-2 ${
              isToday(day) ? 'bg-blue-100' : ''
            } ${isSameMonth(day, currentDate) ? '' : 'text-gray-400'}`}
          >
            <div className="font-semibold mb-1">{format(day, 'EEE dd')}</div>
            <div className="space-y-1">
              {getTasksForDate(day).map((task) => (
                <div
                  key={task.id}
                  className="text-xs p-1 bg-blue-200 rounded truncate"
                  title={task.name}
                >
                  {task.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;