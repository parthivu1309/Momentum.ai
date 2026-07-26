import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export type TaskStatus = 'Completed' | 'Missed' | 'Snoozed' | 'Active' | 'Scheduled';

export interface Task {
  id: string;
  timetableId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  repeatType: string;
  category: 'health' | 'work' | 'study' | 'routine' | string;
  order?: number;
}

export interface TaskResponse {
  id?: string;
  taskId: string;
  date: string;
  status: 'completed' | 'missed' | 'snoozed';
  reason?: string;
  completedAt?: string;
}

export interface TaskWithStatus extends Task {
  status: TaskStatus;
  response?: TaskResponse;
}

export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [responses, setResponses] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksAndResponses = useCallback(async () => {
    try {
      const todayString = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local time
      
      const [fetchedTasks, fetchedResponses] = await Promise.all([
        api.get<Task[]>('/tasks'),
        api.get<TaskResponse[]>(`/task-responses?date=${todayString}`)
      ]);
      
      setTasks(fetchedTasks || []);
      setResponses(fetchedResponses || []);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch tasks/responses:", err);
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksAndResponses();
    
    // Poll every 5 seconds for background updates (Telegram webhook)
    const interval = setInterval(() => {
      fetchTasksAndResponses();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fetchTasksAndResponses]);

  // Add status to all tasks
  const tasksWithStatus: TaskWithStatus[] = tasks.map(task => {
    const today = new Date();
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const response = responses.find(r => r.taskId === task.id);
    let status: TaskStatus = 'Scheduled';

    if (response) {
      if (response.status === 'completed') status = 'Completed';
      else if (response.status === 'missed') status = 'Missed';
      else if (response.status === 'snoozed') status = 'Snoozed';
    } else {
      const [startH, startM] = task.startTime.split(':').map(Number);
      const [endH, endM] = task.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
        status = 'Active';
      } else if (nowMinutes > endMinutes) {
        status = 'Missed';
      } else {
        status = 'Scheduled';
      }
    }
    return { ...task, status, response };
  });

  const sortedTasks = tasksWithStatus.sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Derived state: today's schedule
  const getTodaySchedule = useCallback(() => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sun, 1 = Mon ...

    const scheduledTasks = sortedTasks.filter(task => {
      const repeat = task.repeatType;
      if (repeat === 'daily') return true;
      if (repeat === 'weekdays' && day >= 1 && day <= 5) return true;
      if (repeat === 'weekends' && (day === 0 || day === 6)) return true;
      if (repeat === 'mon-wed-fri' && (day === 1 || day === 3 || day === 5)) return true;
      if (repeat === 'tue-thu' && (day === 2 || day === 4)) return true;
      return false;
    });

    return scheduledTasks;
  }, [sortedTasks]);

  return {
    tasks: sortedTasks,
    responses,
    todaySchedule: getTodaySchedule(),
    isLoading,
    error,
    refetch: fetchTasksAndResponses
  };
}
