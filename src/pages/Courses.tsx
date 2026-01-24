import React, { useState } from 'react';
import { courses } from '@/data/mockData';
import ModuleCard from '@/components/features/ModuleCard';
import LessonViewer from '@/components/features/LessonViewer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Users, Clock, ChevronDown } from 'lucide-react';
import { Lesson } from '@/types/lms';

const Courses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; moduleName: string } | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lesson: Lesson, moduleName: string) => {
    setSelectedLesson({ lesson, moduleName });
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      {/* Course Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {courses.map((course) => (
          <Button
            key={course.id}
            variant={selectedCourse.id === course.id ? 'default' : 'outline'}
            onClick={() => setSelectedCourse(course)}
            className="whitespace-nowrap"
          >
            {course.title}
          </Button>
        ))}
      </div>

      {/* Course Overview */}
      <div className="card-elevated p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
            <p className="text-muted-foreground mt-1">{selectedCourse.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {selectedCourse.enrolledCount} enrolled
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedCourse.duration}
              </span>
              <span>Instructor: {selectedCourse.instructor}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-primary">{selectedCourse.progress}%</p>
            </div>
            <div className="w-32 progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${selectedCourse.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Course Modules</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setExpandedModules(
                  expandedModules.length === selectedCourse.modules.length
                    ? []
                    : selectedCourse.modules.map((m) => m.id)
                )
              }
            >
              <ChevronDown
                className={cn(
                  'w-4 h-4 mr-1 transition-transform',
                  expandedModules.length === selectedCourse.modules.length && 'rotate-180'
                )}
              />
              {expandedModules.length === selectedCourse.modules.length
                ? 'Collapse All'
                : 'Expand All'}
            </Button>
          </div>
          {selectedCourse.modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isExpanded={expandedModules.includes(module.id)}
              onToggle={() => toggleModule(module.id)}
              onLessonClick={(lesson) => handleLessonClick(lesson, module.title)}
            />
          ))}
        </div>
      </div>

      {/* Lesson Viewer Modal */}
      {selectedLesson && (
        <LessonViewer
          lesson={selectedLesson.lesson}
          moduleName={selectedLesson.moduleName}
          onClose={handleCloseLesson}
        />
      )}
    </div>
  );
};

export default Courses;
