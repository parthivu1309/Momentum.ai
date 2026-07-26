'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

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
  { hour: '06:00', completed: 95, fill: 'hsl(var(--chart-1))' },
  { hour: '08:00', completed: 88, fill: 'hsl(var(--chart-1))' },
  { hour: '12:00', completed: 70, fill: 'hsl(var(--chart-2))' },
  { hour: '15:00', completed: 42, fill: 'hsl(var(--chart-3))' },
  { hour: '18:00', completed: 60, fill: 'hsl(var(--chart-4))' },
  { hour: '20:00', completed: 85, fill: 'hsl(var(--chart-5))' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border/50 shadow-premium p-4 rounded-xl">
        <p className="text-sm font-bold text-muted-foreground mb-1">{label}</p>
        <p className="text-xl font-bold text-foreground">
          {payload[0].value}% <span className="text-sm font-medium text-muted-foreground">Completion</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts() {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Analytics</h2>
          <p className="text-muted-foreground text-lg">Visualise your behavioural metrics and long-term trends.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Completion Rate Trend */}
        <Card className="card-premium col-span-2 overflow-hidden">
          <CardHeader className="px-6 md:px-8 pt-8">
            <CardTitle className="text-xl">Weekly Completion Trend</CardTitle>
            <p className="text-muted-foreground text-sm font-medium mt-1">Your daily task completion percentage over the last 7 days.</p>
          </CardHeader>
          <CardContent className="h-[400px] w-full px-2 sm:px-6 md:px-8 pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COMPLETION_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  dy={15} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `${v}%`} 
                  dx={-10} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="natural" 
                  dataKey="rate" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRate)" 
                  activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity by Hour */}
        <Card className="card-premium col-span-2 md:col-span-1">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg">Productivity by Hour</CardTitle>
            <p className="text-muted-foreground text-sm font-medium mt-1">Completion likelihood based on time of day.</p>
          </CardHeader>
          <CardContent className="h-[300px] w-full px-2 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                  {HOURLY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Failure Reasons Placeholder */}
        <Card className="card-premium col-span-2 md:col-span-1">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg">Top Obstacles</CardTitle>
            <p className="text-muted-foreground text-sm font-medium mt-1">What stops you from completing tasks.</p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center gap-6 h-[300px] px-6 pb-6">
            <div className="space-y-6">
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">Phone Distraction</span>
                  <span className="text-sm font-bold text-muted-foreground">42%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-destructive w-[42%] rounded-full" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">Low Energy</span>
                  <span className="text-sm font-bold text-muted-foreground">28%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-warning w-[28%] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">Unexpected Work</span>
                  <span className="text-sm font-bold text-muted-foreground">15%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-info w-[15%] rounded-full" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">Forgot</span>
                  <span className="text-sm font-bold text-muted-foreground">10%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 w-[10%] rounded-full" />
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
