import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, Shield, Moon, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLearningProfile from '@/components/features/UserLearningProfile';

const Settings: React.FC = () => {
  const { user } = useAuth();

  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information',
      items: [
        { label: 'Display Name', value: user?.name },
        { label: 'Email Address', value: user?.email },
        { label: 'Role', value: user?.role, capitalize: true },
      ],
    },
    {
      icon: Bell,
      title: 'Notification Preferences',
      description: 'Control how you receive updates',
      toggles: [
        { id: 'email-notifications', label: 'Email Notifications', defaultChecked: true },
        { id: 'task-reminders', label: 'Task Deadline Reminders', defaultChecked: true },
        { id: 'announcement-alerts', label: 'Announcement Alerts', defaultChecked: true },
        { id: 'progress-updates', label: 'Weekly Progress Updates', defaultChecked: false },
      ],
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your account security',
      actions: [
        { label: 'Change Password', variant: 'outline' as const },
        { label: 'Two-Factor Authentication', variant: 'outline' as const },
      ],
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Customize your experience',
      toggles: [
        { id: 'reduced-motion', label: 'Reduce Motion', defaultChecked: false },
        { id: 'high-contrast', label: 'High Contrast Mode', defaultChecked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and learning profile
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="learning">Learning Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="card-elevated p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>

              {section.items && (
                <div className="space-y-3 ml-12">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className={`text-sm font-medium ${item.capitalize ? 'capitalize' : ''}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {section.toggles && (
                <div className="space-y-4 ml-12">
                  {section.toggles.map((toggle) => (
                    <div key={toggle.id} className="flex items-center justify-between">
                      <Label htmlFor={toggle.id} className="text-sm cursor-pointer">
                        {toggle.label}
                      </Label>
                      <Switch id={toggle.id} defaultChecked={toggle.defaultChecked} />
                    </div>
                  ))}
                </div>
              )}

              {section.actions && (
                <div className="flex gap-3 ml-12">
                  {section.actions.map((action) => (
                    <Button key={action.label} variant={action.variant} size="sm">
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <UserLearningProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
