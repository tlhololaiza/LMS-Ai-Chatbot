import React, { useState } from 'react';
import { tasks } from '@/data/mockData';
import TaskCard from '@/components/features/TaskCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Github, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'pending' | 'submitted' | 'graded';

const Tasks: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' },
  ];

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  const handleOpenSubmit = (taskId: string) => {
    setSelectedTaskId(taskId);
    setGithubUrl('');
    setUrlError('');
    setSubmitDialogOpen(true);
  };

  const validateGithubUrl = (url: string): boolean => {
    const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url);
  };

  const handleSubmit = () => {
    if (!githubUrl.trim()) {
      setUrlError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGithubUrl(githubUrl)) {
      setUrlError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    // In production, this would call an API
    console.log('Submitting task:', selectedTaskId, 'with URL:', githubUrl);
    setSubmitDialogOpen(false);
    setSelectedTaskId(null);
    setGithubUrl('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Task Submissions</h1>
        <p className="text-muted-foreground">
          View and submit your assignments
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-2 bg-background/20 px-1.5 py-0.5 rounded text-xs">
                {tasks.filter((t) => t.status === f.value).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSubmit={handleOpenSubmit} />
          ))
        ) : (
          <div className="card-elevated p-8 text-center">
            <p className="text-muted-foreground">No tasks found for this filter.</p>
          </div>
        )}
      </div>

      {/* Submit Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Submit Task
            </DialogTitle>
            <DialogDescription>
              Paste the link to your GitHub repository. Make sure your repository is
              public so facilitators can review your code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="github-url"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setUrlError('');
                  }}
                  placeholder="https://github.com/username/repository"
                  className={cn('pl-9', urlError && 'border-destructive')}
                />
              </div>
              {urlError && (
                <p className="text-sm text-destructive">{urlError}</p>
              )}
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
              <p className="font-medium">Submission Guidelines:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Repository must be public</li>
                <li>Include a README with setup instructions</li>
                <li>Ensure all code is committed and pushed</li>
                <li>Test your application before submitting</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
