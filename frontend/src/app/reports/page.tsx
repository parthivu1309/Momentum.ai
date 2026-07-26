'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileBarChart, BrainCircuit, RefreshCw, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

interface DailyReport {
  date: string;
  report: string;
  generatedAt: string;
  statistics: {
    completionRate: number;
    completed: number;
    missed: number;
    snoozed: number;
    scheduled: number;
  };
}

export default function Reports() {
  const [reportData, setReportData] = useState<DailyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyReport = async (refresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<DailyReport>(`/reports/daily${refresh ? '?refresh=true' : ''}`);
      setReportData(data);
    } catch (err: any) {
      console.error('Failed to fetch daily report:', err);
      setError('Could not generate the AI daily report. Ensure backend and Gemini API are configured properly.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
  }, []);

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
            <div className="flex justify-end">
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => fetchDailyReport(true)}
                 disabled={isLoading}
                 className="rounded-full shadow-sm text-xs font-medium"
               >
                 <RefreshCw className={clsx("h-3.5 w-3.5 mr-2", isLoading && "animate-spin")} /> 
                 Regenerate Report
               </Button>
            </div>

            {isLoading && !reportData ? (
              <Card className="card-premium overflow-hidden animate-pulse">
                 <div className="h-1.5 w-full bg-muted" />
                 <CardHeader className="pb-4 pt-6 px-6 md:px-8 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                 </CardHeader>
                 <CardContent className="px-6 md:px-8 pb-8 space-y-6">
                    <div className="h-32 bg-muted rounded-xl w-full"></div>
                    <div className="space-y-2">
                       <div className="h-4 bg-muted rounded w-3/4"></div>
                       <div className="h-4 bg-muted rounded w-5/6"></div>
                       <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                 </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-destructive bg-destructive/5 text-destructive p-8 flex flex-col items-center justify-center text-center space-y-4 rounded-xl">
                 <AlertTriangle className="h-10 w-10" />
                 <div>
                    <h3 className="font-bold text-lg">Report Generation Failed</h3>
                    <p className="text-sm opacity-90 mt-1">{error}</p>
                 </div>
                 <Button variant="destructive" onClick={() => fetchDailyReport(false)} className="mt-2">Try Again</Button>
              </Card>
            ) : reportData ? (
              <Card className="card-premium overflow-hidden group">
                {/* Decorative Top Border */}
                <div className={clsx(
                  "h-1.5 w-full",
                  reportData.statistics.completionRate >= 80 ? "bg-success" : reportData.statistics.completionRate >= 50 ? "bg-warning" : "bg-destructive"
                )} />
                
                <CardHeader className="pb-4 pt-6 px-6 md:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{reportData.date}</p>
                      <h3 className="text-2xl font-bold text-foreground">Daily AI Assessment</h3>
                    </div>
                    <div className="flex gap-6 items-center">
                      <div className="text-center">
                         <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Scheduled</p>
                         <p className="text-xl font-bold">{reportData.statistics.scheduled}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Completed</p>
                         <p className="text-xl font-bold text-success">{reportData.statistics.completed}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Completion</p>
                         <div className={clsx(
                           "text-2xl font-bold flex items-center justify-center",
                           reportData.statistics.completionRate >= 80 ? "text-success" : reportData.statistics.completionRate >= 50 ? "text-warning" : "text-destructive"
                         )}>
                           {reportData.statistics.completionRate}%
                         </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 md:px-8 pb-8">
                  {/* AI Insight Box */}
                  <div className="bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/10 relative mt-4 shadow-sm">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md rotate-[-6deg] group-hover:rotate-0 transition-transform duration-300">
                      <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed font-medium">
                       <ReactMarkdown>{reportData.report}</ReactMarkdown>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-right font-medium">Generated at {new Date(reportData.generatedAt).toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            ) : null}
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
