'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, Edit2, Trash2, CalendarHeart } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = {
  health: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500' },
  work: { color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', dot: 'bg-indigo-500' },
  study: { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500' },
  routine: { color: 'bg-slate-500/10 text-slate-600 border-slate-500/20', dot: 'bg-slate-500' },
} as const;

type Category = keyof typeof CATEGORIES;

const MOCK_TASKS = [
  { id: 1, title: 'Morning Walk', startTime: '07:00', endTime: '08:00', repeat: 'daily', category: 'health' as Category },
  { id: 2, title: 'Deep Work Session', startTime: '09:00', endTime: '11:30', repeat: 'daily', category: 'work' as Category },
  { id: 3, title: 'Study DSA', startTime: '14:00', endTime: '15:30', repeat: 'weekdays', category: 'study' as Category },
  { id: 4, title: 'Read 20 pages', startTime: '17:00', endTime: '18:00', repeat: 'daily', category: 'routine' as Category },
  { id: 5, title: 'Gym Workout', startTime: '18:30', endTime: '19:30', repeat: 'mon-wed-fri', category: 'health' as Category },
];

export default function Timetable() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', startTime: '', endTime: '', repeat: 'daily', category: 'work' as Category });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.startTime || !newTask.endTime) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    const task = {
      id: Date.now(),
      ...newTask
    };
    
    const updatedTasks = [...tasks, task].sort((a, b) => a.startTime.localeCompare(b.startTime));
    setTasks(updatedTasks);
    setIsAddOpen(false);
    setNewTask({ title: '', startTime: '', endTime: '', repeat: 'daily', category: 'work' });
    toast.success("Task added to timetable successfully.");
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success("Task removed from timetable.");
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
      <div className="max-w-4xl pt-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <CalendarHeart className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold">Your timeline is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Start building your momentum by adding tasks and constructing your ideal day.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Master Timeline Line */}
            <div className="absolute top-0 bottom-0 left-[68px] w-px bg-gradient-to-b from-transparent via-border to-transparent -z-10" />

            <div className="space-y-6">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div 
                    key={task.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group flex gap-8 relative items-start"
                  >
                    {/* Time Label (Sticky-like feel) */}
                    <div className="w-12 pt-5 shrink-0 text-right">
                      <p className="text-sm font-bold text-foreground">{task.startTime}</p>
                    </div>

                    {/* Timeline Node */}
                    <div className="relative pt-[22px] shrink-0">
                      <div className={clsx("w-3 h-3 rounded-full ring-4 ring-background shadow-sm", CATEGORIES[task.category].dot)} />
                    </div>

                    {/* Task Card */}
                    <Card className={clsx(
                      "flex-1 border bg-card transition-all duration-300 hover:shadow-premium-hover relative overflow-hidden",
                      CATEGORIES[task.category].color
                    )}>
                      {/* Subdued Category Background Overlay */}
                      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl -z-10" />
                      
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-bold text-foreground">{task.title}</h4>
                              <span className={clsx("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-background/50", CATEGORIES[task.category].color)}>
                                {task.category}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center text-xs font-medium text-muted-foreground gap-4 mt-2">
                              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                <Clock className="h-3.5 w-3.5"/> 
                                {task.startTime} — {task.endTime}
                              </span>
                              <span className="capitalize px-2 py-1 bg-muted/50 rounded-md">
                                {task.repeat.replace(/-/g, ' ')}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
      </div>
    </div>
  );
}
