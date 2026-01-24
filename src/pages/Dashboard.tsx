import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, TrendingUp, Bell, ChevronRight, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { courses, tasks, announcements } from '@/data/mockData';
import ProgressCard from '@/components/features/ProgressCard';
import AnnouncementCard from '@/components/features/AnnouncementCard';
import TaskCard from '@/components/features/TaskCard';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const recentAnnouncements = announcements.slice(0, 2);
  const overallProgress = Math.round(
    courses.reduce((acc, c) => acc + c.progress, 0) / courses.length
  );

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: courses.length, color: 'text-primary' },
    { icon: ClipboardList, label: 'Pending Tasks', value: pendingTasks.length, color: 'text-warning' },
    { icon: TrendingUp, label: 'Overall Progress', value: `${overallProgress}%`, color: 'text-success' },
    { icon: Target, label: 'Completed Modules', value: 3, color: 'text-accent-foreground' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your learning progress
          </p>
        </div>
        <Button asChild>
          <Link to="/courses">Continue Learning</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Course Progress */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Courses</h2>
            <Link
              to="/courses"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.map((course) => (
              <ProgressCard
                key={course.id}
                title={course.title}
                progress={course.progress}
                subtitle={`${course.instructor} • ${course.duration}`}
              />
            ))}
          </div>

          {/* Pending Tasks */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pending Tasks</h2>
              <Link
                to="/tasks"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {pendingTasks.slice(0, 2).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-muted-foreground text-sm p-4 text-center card-elevated">
                  No pending tasks. Great job!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Announcements
            </h2>
            <Link
              to="/announcements"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
