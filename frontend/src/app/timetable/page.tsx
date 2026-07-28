'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, Edit2, Trash2, CalendarHeart, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { api, API_BASE_URL } from '@/lib/api';

import { useTasksData } from '@/hooks/useTasksData';

const CATEGORIES = {
  health: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500' },
  work: { color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', dot: 'bg-indigo-500' },
  study: { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500' },
  routine: { color: 'bg-slate-500/10 text-slate-600 border-slate-500/20', dot: 'bg-slate-500' },
} as const;

type Category = keyof typeof CATEGORIES;

export default function Timetable() {
  const { tasks, isLoading, refetch } = useTasksData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', startTime: '', endTime: '', repeat: 'daily', category: 'work' as Category });

  const handleAddTask = async () => {
    console.log("Create Task button clicked");
    console.log("Form submitted");
    console.log("FormData:", newTask);

    if (!newTask.title || !newTask.startTime || !newTask.endTime) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    try {
      console.log("Calling createTask()");
      console.log("API_BASE_URL:", API_BASE_URL);
      
      const payload = {
        timetableId: 'default',
        title: newTask.title,
        startTime: newTask.startTime,
        endTime: newTask.endTime,
        repeatType: newTask.repeat,
        category: newTask.category
      };
      
      const createdTask = await api.post<any>('/tasks', payload);
      
      console.log("createTask() finished");
      console.log("Response:", createdTask);

      await refetch();
      setIsAddOpen(false);
      setNewTask({ title: '', startTime: '', endTime: '', repeat: 'daily', category: 'work' });
      toast.success("Task added to timetable successfully.");
    } catch (error: any) {
      console.error("URL: " + API_BASE_URL + "/tasks");
      console.error("HTTP Method: POST");
      console.error("Request Body:", newTask);
      console.error("Response Status:", error?.status);
      console.error("Response Body:", error?.data);
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      await refetch();
      toast.success("Task removed from timetable.");
    } catch (err) {
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Timetable</h2>
          <p className="text-muted-foreground text-lg">Your master schedule for building unstoppable momentum.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={
            <Button className="rounded-full px-6 shadow-premium hover:shadow-premium-hover transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] border-none shadow-premium">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Task</DialogTitle>
              <DialogDescription>
                Schedule a new behaviour block for your timetable.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Deep Work Session" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="bg-muted/50 border-transparent focus:bg-background"
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <div className="flex gap-2">
                  {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewTask({...newTask, category: cat})}
                      className={clsx(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                        newTask.category === cat ? CATEGORIES[cat].color : "border-transparent text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                    className="bg-muted/50 border-transparent focus:bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                    className="bg-muted/50 border-transparent focus:bg-background"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Repeat</Label>
                <Select value={newTask.repeat} onValueChange={(val) => setNewTask({...newTask, repeat: val || 'daily'})}>
                  <SelectTrigger className="bg-muted/50 border-transparent focus:bg-background">
                    <SelectValue placeholder="Select repeat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="mon-wed-fri">Mon, Wed, Fri</SelectItem>
                    <SelectItem value="tue-thu">Tue, Thu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTask} className="w-full rounded-xl">Save to Timetable</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline Layout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-4xl pt-4"
      >
        {tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-card/50 rounded-3xl border border-border/50 shadow-sm"
          >
            <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <CalendarHeart className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Your timeline is empty</h3>
            <p className="text-muted-foreground mt-3 max-w-md leading-relaxed">
              Start building your momentum by adding tasks and constructing your ideal day.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Master Timeline Line */}
            <div className="absolute top-0 bottom-0 left-[68px] w-px bg-gradient-to-b from-transparent via-border to-transparent -z-10" />

            <div className="space-y-8">
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div 
                    key={task.id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, type: "spring" as const, stiffness: 300, damping: 25 }}
                    className="group flex gap-8 relative items-start"
                  >
                    {/* Time Label (Sticky-like feel) */}
                    <div className="w-12 pt-6 shrink-0 text-right">
                      <p className="text-[15px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{task.startTime}</p>
                    </div>

                    {/* Timeline Node */}
                    <div className="relative pt-[26px] shrink-0 z-10">
                      <div className={clsx(
                        "w-3.5 h-3.5 rounded-full ring-4 ring-background shadow-sm transition-transform duration-300 group-hover:scale-125", 
                        CATEGORIES[task.category as Category]?.dot || 'bg-muted'
                      )} />
                    </div>

                    {/* Task Card */}
                    <Card className={clsx(
                      "flex-1 card-premium bg-card overflow-hidden relative shadow-sm hover:shadow-premium group",
                      task.status === 'Completed' && "opacity-60 hover:opacity-100"
                    )}>
                      {/* Left Colored Accent Bar */}
                      <div className={clsx(
                        "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300",
                        CATEGORIES[task.category as Category]?.dot || 'bg-border',
                        task.status === 'Completed' ? "opacity-50" : "group-hover:w-2"
                      )} />
                      
                      {/* Subdued Category Background Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50 -z-10" />
                      
                      <CardContent className="p-6 pl-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className={clsx(
                                "text-lg font-bold tracking-tight transition-colors",
                                task.status === 'Completed' ? "text-muted-foreground line-through" : "text-foreground"
                              )}>
                                {task.title}
                              </h4>
                              <span className={clsx(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors", 
                                CATEGORIES[task.category as Category]?.color || 'bg-muted text-muted-foreground'
                              )}>
                                {task.category}
                              </span>
                              
                              {/* Status Badges */}
                              {task.status === 'Completed' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-success/10 text-success border border-success/20 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </span>
                              )}
                              {task.status === 'Missed' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-destructive/10 text-destructive border border-destructive/20">
                                  Missed
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center text-xs font-semibold text-muted-foreground gap-3 mt-3">
                              <span className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md text-foreground">
                                <Clock className="h-3.5 w-3.5"/> 
                                {task.startTime} — {task.endTime}
                              </span>
                              <span className="capitalize px-2.5 py-1 bg-muted/40 rounded-md border border-border/50 text-foreground">
                                {task.repeatType.replace(/-/g, ' ')}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground shadow-sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
