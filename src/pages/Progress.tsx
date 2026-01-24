import React from 'react';
import { courses, tasks } from '@/data/mockData';
import { Award, Target, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import ProgressCard from '@/components/features/ProgressCard';

const Progress: React.FC = () => {
  const completedTasks = tasks.filter((t) => t.status === 'graded').length;
  const totalTasks = tasks.length;
  const averageGrade = Math.round(
    tasks
      .filter((t) => t.grade !== undefined)
      .reduce((acc, t) => acc + (t.grade || 0), 0) /
      tasks.filter((t) => t.grade !== undefined).length || 0
  );

  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const completedModules = courses.reduce(
    (acc, c) => acc + c.modules.filter((m) => m.isCompleted).length,
    0
  );

  const stats = [
    {
      icon: Target,
      label: 'Courses Enrolled',
      value: courses.length,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: CheckCircle,
      label: 'Modules Completed',
      value: `${completedModules}/${totalModules}`,
      color: 'bg-success/10 text-success',
    },
    {
      icon: Clock,
      label: 'Tasks Completed',
      value: `${completedTasks}/${totalTasks}`,
      color: 'bg-warning/10 text-warning',
    },
    {
      icon: Award,
      label: 'Average Grade',
      value: `${averageGrade}%`,
      color: 'bg-accent text-accent-foreground',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Progress Tracking</h1>
        <p className="text-muted-foreground">
          Monitor your learning achievements and milestones
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-elevated p-4">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Course Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Course Progress</h2>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <ProgressCard
                key={course.id}
                title={course.title}
                progress={course.progress}
                subtitle={`${course.modules.filter((m) => m.isCompleted).length}/${course.modules.length} modules completed`}
              />
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Recent Achievements</h2>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === 'graded')
              .slice(0, 4)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-success">{task.grade}%</span>
                </div>
              ))}
            {tasks.filter((t) => t.status === 'graded').length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                Complete tasks to see your achievements here!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Module Breakdown */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">Module Breakdown</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.flatMap((course) =>
            course.modules.map((module) => (
              <div
                key={module.id}
                className={`p-4 rounded-lg border ${
                  module.isCompleted
                    ? 'bg-success/5 border-success/20'
                    : module.isLocked
                    ? 'bg-muted/50 border-border'
                    : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {module.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span className="font-medium text-sm truncate">{module.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {module.lessons.filter((l) => l.isCompleted).length}/{module.lessons.length} lessons
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
