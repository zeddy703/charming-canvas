import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Video, Calendar, Clock, Users, Play, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiRequest from '@/utils/api';
import EventRegistrationDialog from '@/components/EventRegistrationDialog';

interface UpcomingEvent {
  id: string;           // changed to string to match your API
  degree: string;
  name: string;
  date: string;
  time?: string;
  going?: number;
  registered?: boolean; // we'll compute this from user data
  isFree?: boolean;     // you'll need to add this field in backend or decide logic
  price?: number;       // same as above
  _id?: string;
}

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    degree: string;
    name: string;
    date: string;
    time: string;
    isFree?: boolean;
    price?: number;
  };
  onSuccess: () => void;
}

interface PastEvent {
  id: string;
  degree: string;
  name: string;
  date: string;
  watched?: boolean;    // we'll compute from user watched list
  _id?: string;
}

interface UserEventsResponse {
  success: boolean;
  data: {
    upcoming: string[];     // array of event IDs the user is registered for
    pastEvents?: string[];  // watched event IDs (if your backend sends this)
    // or separate watched field if structured differently
  };
}

const ThursdayNight = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);

  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [watchedEventIds, setWatchedEventIds] = useState<Set<string>>(new Set());

  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch all upcoming & past events (public list)
        const eventsRes = await apiRequest<{
          success: boolean;
          data: {
            upComing: UpcomingEvent[];
            pastEvents: PastEvent[];
          };
        }>('/api/members/retrieve/thursday-night/events/list', { method: 'GET' });

        if (eventsRes?.success && eventsRes.data) {
          setUpcomingEvents(eventsRes.data.upComing || []);
          setPastEvents(eventsRes.data.pastEvents || []);
        }

        // 2. Fetch user-specific registrations & watched status
        const userRes = await apiRequest<UserEventsResponse>(
          '/api/members/retrieve/thursday-night/user-events/data/list',
          { method: 'GET' }
        );

        if (userRes?.success && userRes.data) {
          setRegisteredEventIds(new Set(userRes.data.upcoming || []));
          
          // If backend sends watched events in pastEvents or separate field:
          if (userRes.data.pastEvents) {
            setWatchedEventIds(new Set(userRes.data.pastEvents));
          }
          // Alternative: if watched is separate field, e.g. userRes.data.watched
          // setWatchedEventIds(new Set(userRes.data.watched || []));
        }
      } catch (err) {
        console.error('Failed to load Thursday Night data:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegisterClick = (event: UpcomingEvent) => {
    if (registeredEventIds.has(event.id)) return; // already registered
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
  };

  const handleRegistrationSuccess = (eventId: string) => {
    // Optimistic update
    setRegisteredEventIds(prev => new Set([...prev, eventId]));
    // You can also refetch user data here if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Thursday Night at the Rite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p className="text-destructive text-center">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                Thursday Night at the Rite
              </h1>
              <p className="text-muted-foreground">
                Bi-weekly online degree presentations for Scottish Rite members
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="progress-card text-center animate-fade-in">
                <Users className="text-primary mx-auto mb-2" size={32} />
                <p className="text-2xl font-heading font-bold text-foreground">1,000+</p>
                <p className="text-sm text-muted-foreground">Members Joined Since 2020</p>
              </div>
              <div className="progress-card text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Video className="text-primary mx-auto mb-2" size={32} />
                <p className="text-2xl font-heading font-bold text-foreground">29</p>
                <p className="text-sm text-muted-foreground">Degrees Available</p>
              </div>
              <div className="progress-card text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Calendar className="text-primary mx-auto mb-2" size={32} />
                <p className="text-2xl font-heading font-bold text-foreground">Bi-Weekly</p>
                <p className="text-sm text-muted-foreground">Every Other Thursday</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="progress-card mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="text-primary" size={20} />
                Upcoming Presentations
              </h3>

              {upcomingEvents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No upcoming presentations scheduled.
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const isRegistered = registeredEventIds.has(event.id);
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                            <span className="font-heading font-bold text-primary-foreground text-lg">
                              {event.degree}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-heading font-semibold text-foreground">
                              {event.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {event.date}
                              </span>
                              {event.time && (
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {event.time}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isRegistered ? (
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center gap-1">
                            <CheckCircle size={14} />
                            Registered
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRegisterClick(event)}
                          >
                            Register
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Events */}
            <div className="progress-card animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Video className="text-primary" size={20} />
                Past Presentations
              </h3>

              {pastEvents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No past presentations available yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {pastEvents.map((event) => {
                    const isWatched = watchedEventIds.has(event.id);
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <span className="font-heading font-semibold text-foreground">
                              {event.degree}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Play size={14} className="mr-1" />
                          {isWatched ? 'Rewatch' : 'Watch'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button variant="outline" className="w-full mt-4">
                View All Past Presentations
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Registration Dialog */}
      {selectedEvent && (
        <EventRegistrationDialog
          isOpen={registrationDialogOpen}
          onClose={() => {
            setRegistrationDialogOpen(false);
            setSelectedEvent(null);
            handleRegistrationSuccess(null);
          }}
          event={{
            id: Number(selectedEvent.id),
            degree: selectedEvent.degree,
            name: selectedEvent.name,
            date: selectedEvent.date,
            time: selectedEvent.time || '',
            isFree: selectedEvent.isFree,
            price: selectedEvent.price,
          }}
        />
      )}
    </div>
  );
};

export default ThursdayNight;

