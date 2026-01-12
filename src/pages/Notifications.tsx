import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiRequest from '@/utils/api';
import type { Notification } from '@/components/NotificationDropdown';

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
            message: 'Your payment of $50 has been processed successfully. Thank you for your contribution.',
            type: 'success',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'New Milestone Available',
            message: 'A new milestone has been unlocked for your path. Check it out to continue your journey.',
            type: 'info',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            title: 'Event Reminder',
            message: 'Thursday Night event starts in 2 hours. Don\'t forget to prepare your materials.',
            type: 'warning',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '4',
            title: 'Profile Update Required',
            message: 'Please update your contact information to ensure you receive important updates.',
            type: 'info',
            read: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: '5',
            title: 'Welcome to Pathfinder',
            message: 'We\'re excited to have you on this journey. Explore your dashboard to get started.',
            type: 'success',
            read: true,
            createdAt: new Date(Date.now() - 604800000).toISOString(),
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
      // Still update locally
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/api/user/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      // Still update locally
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiRequest(`/api/user/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      // Still update locally
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-500/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'error':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <Bell className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 md:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-sm mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border-l-4 transition-all ${getTypeStyles(notification.type)} ${
                          !notification.read ? 'bg-opacity-100' : 'opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getTypeIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-foreground`}>
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full" />
                                )}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Mark as read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
