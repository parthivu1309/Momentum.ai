'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileBarChart, 
  PieChart, 
  Menu,
  ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Timetable', href: '/timetable', icon: CalendarDays },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Charts', href: '/charts', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (!mounted) return <aside className="w-16 md:w-64 border-r border-border bg-sidebar h-screen shrink-0" />;

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isCollapsed ? '4.5rem' : '16rem',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="border-r border-border bg-sidebar/80 backdrop-blur-xl h-screen flex flex-col relative z-20 shrink-0 shadow-premium"
    >
      <div className={clsx("flex items-center pt-8 pb-6", isCollapsed ? "justify-center" : "px-6 justify-between")}>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-premium">
              <div className="w-2 h-2 rounded-sm bg-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
              Momentum
            </h1>
          </motion.div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={clsx("h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg transition-colors", isCollapsed && "mt-1")}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl py-2.5 transition-all duration-200 group relative",
                isCollapsed ? "justify-center px-0 mx-1" : "px-3",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <item.icon className={clsx("h-[18px] w-[18px] shrink-0 transition-colors z-10", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[14px] whitespace-nowrap z-10"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-card text-card-foreground text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-premium border border-border">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-sidebar/50 backdrop-blur-sm">
        <div className={clsx("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-premium">
            <span className="text-[11px] font-bold text-primary">DEV</span>
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm overflow-hidden whitespace-nowrap flex-1"
            >
              <p className="font-semibold text-foreground text-[13px]">Parthiv</p>
              <p className="text-[11px] text-muted-foreground font-medium">Personal Mode</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
