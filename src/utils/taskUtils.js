import { isToday, startOfWeek, endOfWeek, addWeeks } from 'date-fns';

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const groupTasksByDateCategory = (tasks) => {
  const today = new Date();
  const thisWeekStart = startOfWeek(today);
  const thisWeekEnd = endOfWeek(today);
  const nextWeekStart = addWeeks(thisWeekStart, 1);
  const nextWeekEnd = addWeeks(thisWeekEnd, 1);

  const groupedTasks = {
    'Past Dates': [],
    'Today': [],
    'This week': [],
    'Next week': [],
    'Later': [],
    'Without a date': []
  };

  tasks.forEach(task => {
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;

    if (!taskDate) {
      groupedTasks['Without a date'].push(task);
    } else if (taskDate < today) {
      groupedTasks['Past Dates'].push(task);
    } else if (isToday(taskDate)) {
      groupedTasks['Today'].push(task);
    } else if (taskDate >= thisWeekStart && taskDate <= thisWeekEnd) {
      groupedTasks['This week'].push(task);
    } else if (taskDate >= nextWeekStart && taskDate <= nextWeekEnd) {
      groupedTasks['Next week'].push(task);
    } else {
      groupedTasks['Later'].push(task);
    }
  });

  return groupedTasks;
};