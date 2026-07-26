'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileBarChart, BrainCircuit, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

const DAILY_REPORTS = [
  { 
    id: 1, 
    date: 'Today, 25 Jul', 
    completion: 67, 
    trend: 'down',
    title: 'Energy Dip',
    insight: "Steady progress in the morning. However, you missed your afternoon session due to 'Low Energy'. Consider moving heavy analytical tasks before 2 PM.",
    strengths: ['Morning Routine', 'Deep Work'],
    weaknesses: ['Afternoon Slump'],
  },
  { 
    id: 2, 
    date: 'Yesterday, 24 Jul', 
    completion: 91, 
    trend: 'up',
    title: 'Peak Performance',
    insight: "Excellent consistency. Completing the morning workout led to a 100% completion rate for deep work. This pattern is highly effective.",
    strengths: ['Exercise', 'Focus', 'Consistency'],
    weaknesses: [],
  }
];

export default function Reports() {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">AI Reports</h2>
          <p className="text-muted-foreground text-lg max-w-xl">Personalised behavioural coaching and pattern analysis.</p>
        </div>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3 p-1 h-auto bg-muted/50 rounded-xl">
          <TabsTrigger value="daily" className="rounded-lg py-2 text-sm font-medium data-[state=active]:shadow-sm">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg py-2 text-sm font-medium data-[state=active]:shadow-sm">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg py-2 text-sm font-medium data-[state=active]:shadow-sm">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-8">
          <div className="space-y-8 max-w-4xl">
            {DAILY_REPORTS.map((report) => (
              <Card key={report.id} className="card-premium overflow-hidden group">
                {/* Decorative Top Border */}
                <div className={clsx(
                  "h-1.5 w-full",
                  report.completion >= 80 ? "bg-success" : report.completion >= 60 ? "bg-warning" : "bg-destructive"
                )} />
                
                <CardHeader className="pb-4 pt-6 px-6 md:px-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{report.date}</p>
                      <h3 className="text-2xl font-bold text-foreground">{report.title}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={clsx(
                        "text-3xl font-bold flex items-center gap-2",
                        report.completion >= 80 ? "text-success" : report.completion >= 60 ? "text-warning" : "text-destructive"
                      )}>
                        {report.completion}%
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mt-1">
                        {report.trend === 'up' ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                        {report.trend === 'up' ? 'Trending Up' : 'Trending Down'}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 md:px-8 pb-8 space-y-8">
                  {/* AI Insight Box */}
                  <div className="bg-primary/5 rounded-xl p-5 md:p-6 border border-primary/10 relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm rotate-[-6deg] group-hover:rotate-0 transition-transform">
                      <BrainCircuit className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <p className="text-foreground leading-relaxed font-medium">
                      "{report.insight}"
                    </p>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" /> Key Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.strengths.map(s => (
                          <span key={s} className="px-3 py-1.5 bg-success/10 text-success text-xs font-bold rounded-lg border border-success/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {report.weaknesses.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" /> Areas to Improve
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.weaknesses.map(w => (
                            <span key={w} className="px-3 py-1.5 bg-warning/10 text-warning-foreground text-xs font-bold rounded-lg border border-warning/20">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-8">
          <Card className="card-premium">
            <CardContent className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FileBarChart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Weekly Report Generating</h3>
              <p className="text-muted-foreground mt-3 max-w-md text-lg">
                Complete your week to generate a comprehensive 7-day pattern analysis.
              </p>
              <Button className="mt-6 rounded-full" variant="outline">
                View Past Weeks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-8">
          <Card className="card-premium">
            <CardContent className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FileBarChart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Not Enough Data</h3>
              <p className="text-muted-foreground mt-3 max-w-md text-lg">
                You need at least 30 days of behavioural data for the AI to identify long-term macroscopic patterns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
