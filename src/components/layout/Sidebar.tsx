import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LMSLogo from '@/assets/LMS-Logo.png';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: Bell, label: 'Announcements', path: '/announcements' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={LMSLogo} alt="CodeTribe Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-semibold text-sidebar-foreground">CodeTribe</h1>
                <p className="text-xs text-sidebar-foreground/60">Academy</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground"
              onClick={onToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-foreground">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn('nav-link', isActive && 'nav-link-active')
                }
                onClick={() => window.innerWidth < 1024 && onToggle()}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn('nav-link', isActive && 'nav-link-active')
              }
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
            <button
              onClick={logout}
              className="nav-link w-full text-left hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={onToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
};

export default Sidebar;
