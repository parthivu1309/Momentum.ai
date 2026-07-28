'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

import { motion } from 'framer-motion';

const COMPLETION_DATA = [
  { day: 'Mon', rate: 45 },
  { day: 'Tue', rate: 70 },
  { day: 'Wed', rate: 85 },
  { day: 'Thu', rate: 91 },
  { day: 'Fri', rate: 67 },
  { day: 'Sat', rate: 50 },
  { day: 'Sun', rate: 82 },
];

const HOURLY_DATA = [
  { hour: '06:00', completed: 95, fill: 'var(--primary)' },
  { hour: '08:00', completed: 88, fill: 'var(--primary)' },
  { hour: '12:00', completed: 70, fill: 'var(--primary)' },
  { hour: '15:00', completed: 42, fill: 'var(--muted-foreground)' },
  { hour: '18:00', completed: 60, fill: 'var(--primary)' },
  { hour: '20:00', completed: 85, fill: 'var(--primary)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border/60 shadow-premium p-4 rounded-xl">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-2xl font-bold text-foreground">
          {payload[0].value}% <span className="text-xs font-semibold text-muted-foreground ml-1">COMPLETION</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Analytics</h2>
          <p className="text-muted-foreground text-lg">Visualise your behavioural metrics and long-term trends.</p>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Completion Rate Trend */}
        <motion.div variants={itemVariants} className="col-span-2">
          <Card className="card-premium overflow-hidden border-border/60 shadow-sm hover:shadow-premium transition-all duration-300 group">
            <CardHeader className="px-6 md:px-8 pt-8">
              <CardTitle className="text-xl">Weekly Completion Trend</CardTitle>
              <p className="text-muted-foreground text-sm font-medium mt-1">Your daily task completion percentage over the last 7 days.</p>
            </CardHeader>
            <CardContent className="h-[400px] w-full px-2 sm:px-6 md:px-8 pb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={COMPLETION_DATA} margin={{ top: 30, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                  <XAxis 
                    dataKey="day" 
                    stroke="var(--muted-foreground)" 
                    fontSize={11} 
                    fontWeight={700}
                    tickLine={false} 
                    axisLine={false} 
                    dy={15} 
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={11} 
                    fontWeight={700}
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `${v}%`} 
                    dx={-10} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="var(--primary)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                    activeDot={{ r: 6, strokeWidth: 4, stroke: 'var(--background)', fill: 'var(--primary)' }}
                    filter="url(#glow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Productivity by Hour */}
        <motion.div variants={itemVariants}>
          <Card className="card-premium h-full border-border/60 shadow-sm hover:shadow-premium transition-all duration-300">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg">Productivity by Hour</CardTitle>
              <p className="text-muted-foreground text-sm font-medium mt-1">Completion likelihood based on time of day.</p>
            </CardHeader>
            <CardContent className="h-[300px] w-full px-2 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_DATA} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                  <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.3 }} />
                  <Bar dataKey="completed" radius={[6, 6, 0, 0]} barSize={24}>
                    {HOURLY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300 hover:opacity-80" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Failure Reasons Placeholder */}
        <motion.div variants={itemVariants}>
          <Card className="card-premium h-full border-border/60 shadow-sm hover:shadow-premium transition-all duration-300">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-lg">Top Obstacles</CardTitle>
              <p className="text-muted-foreground text-sm font-medium mt-1">What stops you from completing tasks.</p>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-6 h-[300px] px-8 pb-8">
              <div className="space-y-7 w-full">
                
                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-foreground group-hover:text-destructive transition-colors">Phone Distraction</span>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-destructive transition-colors">42%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-destructive w-[42%] rounded-full shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]" />
                  </div>
                </div>
                
                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-foreground group-hover:text-warning transition-colors">Low Energy</span>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-warning transition-colors">28%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-warning w-[28%] rounded-full shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]" />
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-foreground group-hover:text-info transition-colors">Unexpected Work</span>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-info transition-colors">15%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-info w-[15%] rounded-full shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]" />
                  </div>
                </div>
                
                <div className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Forgot</span>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">10%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary/50 w-[10%] rounded-full shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]" />
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
