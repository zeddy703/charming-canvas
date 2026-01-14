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
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiRequest(`/api/user/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
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
        return <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'warning':
        return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 'error':
        return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
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

        <main className="p-2 sm:p-4 md:p-6">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 px-3 sm:px-6">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8">
          <Card className="border-0 sm:border">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4 px-4 sm:px-6">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  Notifications
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {unreadCount > 0 
                    ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                    : 'All caught up!'}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead} 
                  className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </CardHeader>

            <CardContent className="px-2 sm:px-6">
              <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-280px)]">
            <CardContent className="px-2 sm:px-4 md:px-6">
              <ScrollArea className="h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] md:h-[calc(100vh-280px)] pr-2 sm:pr-4">
                {loading ? (
                  <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-20 sm:h-24 bg-muted animate-pulse rounded-lg" />
                      <div 
                        key={i} 
                        className="h-24 sm:h-28 md:h-32 bg-muted animate-pulse rounded-lg" 
                      />
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-12 sm:py-16 text-center text-muted-foreground">
                    <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-base sm:text-lg font-medium">No notifications</h3>
                    <p className="text-xs sm:text-sm mt-1">You're all caught up!</p>
                  <div className="py-12 sm:py-16 md:py-20 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-base sm:text-lg md:text-xl font-medium">No notifications</h3>
                    <p className="text-xs sm:text-sm mt-2">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                  <div className="space-y-2 sm:space-y-3">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 sm:p-4 rounded-lg border-l-4 transition-all ${getTypeStyles(notification.type)} ${
                        className={`p-3 sm:p-4 md:p-5 rounded-lg border-l-4 transition-all ${getTypeStyles(notification.type)} ${
                          !notification.read ? 'bg-opacity-100' : 'opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="mt-0.5 shrink-0">{getTypeIcon(notification.type)}</div>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {getTypeIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                              <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-foreground`}>
                                {notification.title}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm sm:text-base ${
                                !notification.read ? 'font-semibold' : 'font-medium'
                              } text-foreground flex items-center gap-2 flex-wrap`}>
                                <span className="break-words">{notification.title}</span>
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">
                            
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 leading-relaxed break-words">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                            
                            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 mt-3 sm:mt-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs px-2 sm:px-3"
                                  className="h-8 sm:h-9 text-xs sm:text-sm w-full xs:w-auto justify-center xs:justify-start"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  <span className="hidden xs:inline">Mark as </span>read
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                                  Mark as read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive px-2 sm:px-3"
                                className="h-8 sm:h-9 text-xs sm:text-sm text-destructive hover:text-destructive w-full xs:w-auto justify-center xs:justify-start"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
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