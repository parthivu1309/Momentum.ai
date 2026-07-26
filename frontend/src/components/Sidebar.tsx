'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileBarChart, 
  PieChart, 
  Menu,
  ChevronLeft,
  Sun,
  Moon
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
  const { theme, setTheme } = useTheme();

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

  if (!mounted) return <aside className="w-16 md:w-64 border-r border-border/50 bg-background h-screen shrink-0" />;

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isCollapsed ? '4.5rem' : '16rem',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="border-r border-border/50 bg-background h-screen flex flex-col relative z-20 shrink-0 shadow-sm"
    >
      <div className={clsx("flex items-center pt-8 pb-6", isCollapsed ? "justify-center" : "px-6 justify-between")}>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary-foreground" />
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
          className={clsx("h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-lg", isCollapsed && "mt-1")}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto overflow-x-hidden">
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
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
              )}
            >
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <item.icon className={clsx("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-premium border">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm space-y-3">
        <div className={clsx("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <span className="text-[10px] font-bold text-primary">DEV</span>
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm overflow-hidden whitespace-nowrap flex-1"
            >
              <p className="font-semibold text-foreground text-xs">Developer</p>
              <p className="text-[11px] text-muted-foreground font-medium">Personal Mode</p>
            </motion.div>
          )}
        </div>
        
        <div className={clsx("flex items-center", isCollapsed ? "justify-center" : "px-2 justify-between")}>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-medium text-muted-foreground"
            >
              Theme
            </motion.span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-7 w-7 rounded-md text-muted-foreground hover:bg-muted/50"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
