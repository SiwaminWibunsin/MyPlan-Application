import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameMonth, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TableView from '@/components/dashboard/TableView';
import CalendarView from '@/components/dashboard/CalendarView';
import { useTaskData } from '@/hooks/useTaskData';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('week');
  const { tasks, loadData } = useTaskData();

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [loadData]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">No tasks found. Create a plan to add tasks.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="table">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TableView tasks={tasks} />
        </TabsContent>
        <TabsContent value="calendar">
          <div className="flex justify-end mb-4">
            <Select value={calendarView} onValueChange={setCalendarView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CalendarView 
            tasks={tasks} 
            currentDate={currentDate} 
            setCurrentDate={setCurrentDate} 
            calendarView={calendarView} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;