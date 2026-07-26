'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { useTasksData, TaskWithStatus } from '@/hooks/useTasksData';
import { api } from '@/lib/api';

export default function Dashboard() {
  const { todaySchedule, isLoading, refetch } = useTasksData();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const scheduledToday = todaySchedule.length;
  const completedTasks = todaySchedule.filter(t => t.status === 'Completed');
  const completedToday = completedTasks.length;
  const completionPercentage = scheduledToday > 0 ? Math.round((completedToday / scheduledToday) * 100) : 0;
  
  // Note: True streak requires full history, using an estimate for MVP based on today
  const streak = completionPercentage > 0 ? 1 : 0; 
  const behaviourScore = (completionPercentage / 10).toFixed(1);

  const pendingTasks = todaySchedule.filter(t => t.status === 'Active' || t.status === 'Scheduled');
  const firstPending = pendingTasks[0];
  const secondPending = pendingTasks[1];

  const handleComplete = async (taskId: string) => {
    try {
      await api.post('/task-responses', {
        taskId,
        date: new Date().toLocaleDateString('en-CA'),
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. TOP SECTION: Personalised Welcome & Hero Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Good Morning, Developer.</h2>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            {completionPercentage >= 80 
              ? "Your discipline is excellent today. Keep the momentum going." 
              : "Let's conquer today. Every block counts towards your momentum."}
          </p>
        </div>
        <Button className="rounded-full px-6 shadow-premium hover:shadow-premium-hover transition-all bg-primary text-primary-foreground">
          <Sparkles className="mr-2 h-4 w-4" /> Start Deep Work
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="card-premium border-l-4 border-l-primary group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-1.5 mt-4 bg-muted" />
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-orange-500 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{streak} Day{streak !== 1 ? 's' : ''}</div>
            <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" /> Consistent behaviour
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-emerald-500 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              Behaviour Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{behaviourScore}<span className="text-lg text-muted-foreground">/10</span></div>
            <p className="text-xs text-success mt-4 font-medium flex items-center gap-1">
              Based on today's execution
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium bg-gradient-to-br from-primary/10 to-transparent border-transparent">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground text-sm">Momentum AI</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Your focus peaks at 10 AM. Schedule your hardest task then.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. MIDDLE SECTION: Schedule & Progress */}
      <div className="grid gap-6 md:grid-cols-3 pt-4">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Today's Schedule</h3>
            <Link href="/timetable">
              <Button variant="ghost" size="sm" className="text-primary text-xs font-medium">View Timetable <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {firstPending ? (
              <div className="group relative pl-6">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[5px] top-[18px] ring-4 ring-background shadow-sm" />
                <div className="absolute w-px h-full bg-border left-0 top-[28px] -z-10" />
                <Card className={`card-premium shadow-premium-hover ${firstPending.status === 'Active' ? 'border-primary/20 bg-primary/5' : 'bg-card border-border'}`}>
                  <CardContent className="p-5 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-bold text-primary">{firstPending.startTime}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">{firstPending.status}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{firstPending.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1.5 gap-3">
                          <span className="flex items-center gap-1.5 font-medium"><Clock className="h-3.5 w-3.5"/> {firstPending.startTime} - {firstPending.endTime}</span>
                          <span className="px-2 py-0.5 rounded-full bg-background border font-medium capitalize">{firstPending.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleComplete(firstPending.id)} size="sm" className="rounded-full shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                      Complete
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="p-6 text-center border rounded-xl bg-muted/20">
                <p className="text-muted-foreground font-medium">No active or upcoming tasks.</p>
              </div>
            )}

            {secondPending && (
              <div className="group relative pl-6 opacity-60 hover:opacity-100 transition-opacity">
                <div className="absolute w-3 h-3 bg-muted-foreground/30 rounded-full -left-[5px] top-[18px] ring-4 ring-background" />
                <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-premium transition-all">
                  <CardContent className="p-5 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-bold text-foreground">{secondPending.startTime}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">{secondPending.status}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{secondPending.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1.5 gap-3">
                          <span className="flex items-center gap-1.5 font-medium"><Clock className="h-3.5 w-3.5"/> {secondPending.startTime} - {secondPending.endTime}</span>
                          <span className="px-2 py-0.5 rounded-full bg-muted border font-medium capitalize">{secondPending.category}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Motivation & Overview */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Focus</h3>
          <Card className="card-premium h-[calc(100%-2.5rem)]">
            <CardContent className="p-8 flex flex-col justify-center h-full items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-inner">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Keep the Momentum</h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Discipline equals freedom. You have completed {completedToday} out of {scheduledToday} scheduled blocks today. 
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: Completed & Recent */}
      <div className="pt-4">
        <h3 className="text-xl font-bold tracking-tight mb-6">Completed Today</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {completedTasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-premium transition-shadow group">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-sm">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{task.startTime} - {task.endTime}</p>
              </div>
            </div>
          ))}
          
          {completedTasks.length === 0 && (
            <div className="flex items-center justify-center p-4 rounded-xl border border-dashed bg-muted/30 text-muted-foreground text-sm font-medium">
              No tasks completed yet today.
            </div>
          )}
          
          {completedTasks.length > 0 && scheduledToday > completedToday && (
            <div className="flex items-center justify-center p-4 rounded-xl border border-dashed bg-muted/30 text-muted-foreground text-sm font-medium">
              Next task waiting to be crushed...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
