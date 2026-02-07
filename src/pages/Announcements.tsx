import React, { useState } from 'react';
import { announcements as initialAnnouncements } from '@/data/mockData';
import AnnouncementCard from '@/components/features/AnnouncementCard';
import { Button } from '@/components/ui/button';
import { Bell, Filter } from 'lucide-react';
import { Announcement } from '@/types/lms';

type PriorityFilter = 'all' | 'urgent' | 'important' | 'normal';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [filter, setFilter] = useState<PriorityFilter>('all');

  const filters: { value: PriorityFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'important', label: 'Important' },
    { value: 'normal', label: 'General' },
  ];

  const filteredAnnouncements = announcements.filter((a) =>
    filter === 'all' ? true : a.priority === filter
  );

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  const markAllAsRead = () => {
    setAnnouncements((prev) =>
      prev.map((a) => ({ ...a, isRead: true }))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Stay updated with important notices and updates
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))
        ) : (
          <div className="card-elevated p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
