import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiRequest from '@/utils/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiRequest<{ success: boolean; notifications: Notification[] }>(
          '/api/user/notifications',
          { method: 'GET' }
        );

        if (response.success && response.notifications) {
          setNotifications(response.notifications);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        // Fallback with sample notifications for demo
        setNotifications([
          {
            id: '1',
            title: 'Payment Received',
            message: 'Your payment of $50 has been processed successfully.',
            type: 'success',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'New Milestone Available',
            message: 'A new milestone has been unlocked for your path.',
            type: 'info',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            title: 'Event Reminder',
            message: 'Thursday Night event starts in 2 hours.',
            type: 'warning',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiRequest(`/api/user/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-500/10';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/10';
      case 'error':
        return 'border-l-red-500 bg-red-500/10';
      default:
        return 'border-l-primary bg-primary/10';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.slice(0, 5).map(notification => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full text-left p-3 rounded-lg border-l-4 transition-colors hover:bg-muted/50 ${getTypeStyles(notification.type)} ${
                    !notification.read ? 'font-medium' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-foreground">{notification.title}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
          >
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
