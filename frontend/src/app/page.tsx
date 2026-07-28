'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Activity,
  CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTasksData } from '@/hooks/useTasksData';
import { api } from '@/lib/api';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// Dummy data for sparklines
const sparklineDataCompletion = [{v: 40}, {v: 50}, {v: 45}, {v: 60}, {v: 75}, {v: 80}, {v: 100}];
const sparklineDataStreak = [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}, {v: 6}, {v: 7}];
const sparklineDataScore = [{v: 6.5}, {v: 7.2}, {v: 7.0}, {v: 8.1}, {v: 7.9}, {v: 8.5}, {v: 9.0}];

export default function Dashboard() {
  const { todaySchedule, isLoading, refetch } = useTasksData();
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('Good Evening');
  
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

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
  const remainingSessions = scheduledToday - completedToday;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      
      {/* 1. TOP SECTION: Personalised Welcome & Hero Stats */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {greeting}, Parthiv <span className="animate-pulse">👋</span>
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium text-foreground">
              Today's Focus: You have {scheduledToday} planned sessions.
            </p>
            <p className="text-muted-foreground text-md max-w-xl leading-relaxed">
              {completionPercentage >= 80 
                ? "Your discipline is excellent today. Keep the momentum going." 
                : "Complete your Deep Work block and crush today's goals."}
            </p>
          </div>
        </div>
        <Button className="rounded-xl h-11 px-6 shadow-premium hover:shadow-premium-hover transition-all bg-primary text-primary-foreground text-sm font-semibold">
          <Sparkles className="mr-2 h-4 w-4" /> Start Deep Work
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-4">
        <Card className="card-premium group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Completion %</span>
              <span className="text-success text-[10px] flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/> +12%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mt-2">
              <div className="text-4xl font-bold text-foreground tracking-tight">{completionPercentage}%</div>
              <div className="w-16 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineDataCompletion}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Flame className="h-4 w-4 text-warning" /> Current Streak</span>
              <span className="text-success text-[10px] flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/> Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mt-2">
              <div className="text-4xl font-bold text-foreground tracking-tight">{streak} <span className="text-xl text-muted-foreground font-medium">d</span></div>
              <div className="w-16 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineDataStreak}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="v" stroke="var(--warning)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-success" /> Behaviour Score</span>
              <span className="text-success text-[10px] flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/> +0.4</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mt-2">
              <div className="text-4xl font-bold text-foreground tracking-tight">{behaviourScore}</div>
              <div className="w-16 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineDataScore}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="v" stroke="var(--success)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-6 flex flex-col justify-center h-full relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <BrainCircuit className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-1 rounded-md">AI Insight</span>
            </div>
            <h4 className="font-bold text-foreground text-sm leading-snug">
              Your focus peaks at 10 AM. Schedule your hardest tasks then.
            </h4>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex gap-0.5">
                {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-success" />)}
                <div className="w-1.5 h-1.5 rounded-full bg-success/30" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">High Confidence</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. MIDDLE SECTION: Schedule & Progress */}
      <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-3 pt-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Today's Schedule</h3>
            <Link href="/timetable">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs font-semibold rounded-lg hover:bg-muted/50 transition-colors">
                View Timetable <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {firstPending ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative"
                >
                  <Card className={`card-premium overflow-hidden transition-all duration-500 shadow-premium-hover ${firstPending.status === 'Active' ? 'ring-1 ring-primary/30 bg-primary/5' : 'bg-card'}`}>
                    <div className={clsx(
                      "absolute left-0 top-0 bottom-0 w-1.5",
                      firstPending.status === 'Active' ? "bg-primary animate-pulse" : "bg-border"
                    )} />
                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pl-8">
                      <div className="flex gap-6 items-center w-full">
                        <div className="text-center min-w-[70px]">
                          <p className="text-lg font-bold text-foreground">{firstPending.startTime}</p>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1 px-2 py-0.5 bg-primary/10 rounded-full inline-block">
                            {firstPending.status}
                          </p>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-foreground tracking-tight">{firstPending.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-2 gap-4">
                            <span className="flex items-center gap-1.5 font-medium bg-muted/50 px-2.5 py-1 rounded-md text-foreground">
                              <Clock className="h-3.5 w-3.5 text-primary"/> {firstPending.startTime} - {firstPending.endTime}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-muted/30 border border-border/50 font-medium capitalize text-foreground flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-warning" /> {firstPending.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleComplete(firstPending.id)} size="lg" className="rounded-xl shadow-premium hover:shadow-premium-hover bg-primary text-primary-foreground font-semibold w-full md:w-auto shrink-0 transition-all hover:bg-primary/90 hover:-translate-y-0.5">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Complete Block
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 text-center border border-border rounded-2xl bg-card/50 shadow-sm"
                >
                  <CheckCircle className="h-10 w-10 text-success mx-auto mb-4 opacity-50" />
                  <p className="text-foreground font-semibold text-lg">All caught up!</p>
                  <p className="text-muted-foreground text-sm mt-1">No active or upcoming tasks left for today.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {secondPending && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <Card className="card-premium overflow-hidden bg-card border-border shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-border group-hover:bg-muted-foreground/30 transition-colors" />
                  <CardContent className="p-5 flex justify-between items-center pl-7">
                    <div className="flex gap-6 items-center">
                      <div className="text-center min-w-[70px]">
                        <p className="text-base font-bold text-muted-foreground group-hover:text-foreground transition-colors">{secondPending.startTime}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-base">{secondPending.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1.5 gap-3">
                          <span className="flex items-center gap-1 font-medium"><Clock className="h-3 w-3"/> {secondPending.endTime}</span>
                          <span className="capitalize">{secondPending.category}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Motivation & Overview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Focus</h3>
          </div>
          <Card className="card-premium h-[calc(100%-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-card to-background">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <CardContent className="p-8 flex flex-col justify-center h-full items-center text-center space-y-8 relative z-10">
              
              {/* Circular Progress (Custom SVG for premium look) */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="6" />
                  <motion.circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0, 283" }}
                    animate={{ strokeDasharray: `${(completionPercentage / 100) * 283}, 283` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold tracking-tighter text-foreground">{completionPercentage}%</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Done</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xl text-foreground">Discipline = Freedom</h4>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[200px] mx-auto">
                  You have <strong className="text-foreground">{completedToday}</strong> blocks completed and <strong className="text-foreground">{remainingSessions}</strong> remaining. 
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* 3. BOTTOM SECTION: Completed & Recent */}
      <motion.div variants={itemVariants} className="pt-8">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-6 border-b border-border/50 pb-4">Completed Today</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <AnimatePresence>
            {completedTasks.map((task, index) => (
              <motion.div 
                key={task.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-premium transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0 border border-success/20 group-hover:scale-110 group-hover:bg-success/20 transition-all">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.startTime} - {task.endTime}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {completedTasks.length === 0 && (
            <div className="col-span-full flex items-center justify-center p-8 rounded-2xl border border-dashed border-border bg-card/30 text-muted-foreground text-sm font-medium">
              No tasks completed yet today. Let's get to work.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
