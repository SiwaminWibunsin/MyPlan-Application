import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { reorder } from '../utils/taskUtils';

const Plan = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTopTask, setNewTopTask] = useState('');
  const [newBottomTask, setNewBottomTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openCalendars, setOpenCalendars] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const currentPlan = plans.find(p => p.id.toString() === planId && p.userId === user.id);
    setPlan(currentPlan);
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const userTasks = allTasks.filter(t => t.planId === planId && t.userId === user.id);
    setTasks(userTasks);
  }, [planId]);

  const addTask = (taskName, position = 'bottom') => {
    if (taskName.trim()) {
      const newTaskObj = {
        id: Date.now(),
        name: taskName,
        status: 'Not Started',
        dueDate: null,
        planId: planId,
        userId: currentUser.id,
        notes: '',
      };
      const updatedTasks = position === 'top' ? [newTaskObj, ...tasks] : [...tasks, newTaskObj];
      setTasks(updatedTasks);
      updateTasksInLocalStorage(updatedTasks);
      position === 'top' ? setNewTopTask('') : setNewBottomTask('');
    }
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, ...updates } : task);
    setTasks(updatedTasks);
    updateTasksInLocalStorage(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    updateTasksInLocalStorage(updatedTasks);
    toast.success('Task deleted successfully');
  };

  const updateTasksInLocalStorage = (updatedTasks) => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const otherTasks = allTasks.filter(t => t.planId !== planId || t.userId !== currentUser.id);
    localStorage.setItem('tasks', JSON.stringify([...otherTasks, ...updatedTasks]));
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    if (isBefore(dueDateObj, today)) {
      return { text: 'Overdue', className: 'bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-semibold' };
    }
    const daysUntilDue = differenceInDays(dueDateObj, today);
    if (daysUntilDue === 0) {
      return { text: 'Due today', className: 'bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold' };
    }
    return { text: `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`, className: 'bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-semibold' };
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = reorder(tasks, result.source.index, result.destination.index);
    setTasks(reorderedTasks);
    updateTasksInLocalStorage(reorderedTasks);
  };

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || task.status === statusFilter)
  );

  const activeTasks = filteredTasks.filter(task => task.status !== 'Completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'Completed');

  const renderTaskTable = (tasks, isCompleted = false) => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={task.status === 'Completed'}
                            onCheckedChange={(checked) => updateTask(task.id, { status: checked ? 'Completed' : 'In Progress' })}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCompleted ? <span>{task.name}</span> : 
                            <Input value={task.name} onChange={(e) => updateTask(task.id, { name: e.target.value })} className="w-full" />
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select value={task.status} onValueChange={(value) => updateTask(task.id, { status: value })} disabled={isCompleted}>
                            <SelectTrigger className={cn("w-32", {
                              'bg-green-500 text-white': task.status === 'Completed',
                              'bg-yellow-500 text-white': task.status === 'In Progress',
                              'bg-gray-500 text-white': task.status === 'Not Started'
                            })}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Popover open={openCalendars[task.id]} onOpenChange={(open) => setOpenCalendars(prev => ({ ...prev, [task.id]: open }))}>
                              <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-[180px] justify-start text-left font-normal", !task.dueDate && "text-muted-foreground")} disabled={isCompleted}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {task.dueDate ? format(new Date(task.dueDate), "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={task.dueDate ? new Date(task.dueDate) : undefined}
                                  onSelect={(date) => {
                                    updateTask(task.id, { dueDate: date ? date.toISOString() : null });
                                    setOpenCalendars(prev => ({ ...prev, [task.id]: false }));
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {task.dueDate && (
                              <span className={getDueDateStatus(task.dueDate).className}>
                                {getDueDateStatus(task.dueDate).text}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCompleted ? <span>{task.notes || 'No notes'}</span> :
                            <Input type="text" placeholder="Add notes..." value={task.notes || ''} onChange={(e) => updateTask(task.id, { notes: e.target.value })} />
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button onClick={() => deleteTask(task.id)} variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {!isCompleted && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <div className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Add a new task..."
                          value={newBottomTask}
                          onChange={(e) => setNewBottomTask(e.target.value)}
                          className="mr-2 flex-grow"
                          onKeyPress={(e) => e.key === 'Enter' && addTask(newBottomTask, 'bottom')}
                        />
                        <Button onClick={() => addTask(newBottomTask, 'bottom')} className="bg-blue-500 text-white hover:bg-blue-600">
                          <Plus className="h-4 w-4 mr-2" /> Add Task
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">To-Do Plan of {plan.name}</h1>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="New task"
            value={newTopTask}
            onChange={(e) => setNewTopTask(e.target.value)}
            className="mr-2"
            onKeyPress={(e) => e.key === 'Enter' && addTask(newTopTask, 'top')}
          />
          <Button onClick={() => addTask(newTopTask, 'top')} className="bg-blue-500 text-white hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>
      </div>
      {renderTaskTable(activeTasks)}
      <div className="mt-8">
        <Button onClick={() => setShowCompleted(!showCompleted)} className="mb-4 flex items-center">
          {showCompleted ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
          {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
        </Button>
        {showCompleted && (
          <>
            <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
            {renderTaskTable(completedTasks, true)}
          </>
        )}
      </div>
    </div>
  );
};

export default Plan;