import { useState, useCallback } from 'react';

export const useTaskData = () => {
  const [tasks, setTasks] = useState([]);

  const loadData = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const userTasks = allTasks.filter(task => task.userId === user.id);
    setTasks(userTasks);
  }, []);

  return { tasks, loadData };
};