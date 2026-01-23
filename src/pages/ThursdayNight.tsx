import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Video, Calendar, Clock, Users, Play, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiRequest from '@/utils/api';

interface Event {
  id: string;
  name: string;
  degree: string;
  date: string;
  time?: string;          // only upcoming usually has time
  going?: number;
  _id?: string;           // mongo id, optional
}

interface UserEventData {
  upcoming: string[];     // array of event ids user is registered for
  pastEvents?: string[];  // optional - watched event ids
  // if backend sends watched separately, adjust accordingly
}

const ThursdayNight = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allUpcoming, setAllUpcoming] = useState<Event[]>([]);
  const [allPast, setAllPast] = useState<Event[]>([]);

  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch general upcoming & past events
        const eventsRes = await apiRequest<{
          success: boolean;
          data: {
            upComing: Event[];
            pastEvents: Event[];
          };
        }>('/api/members/retrieve/thursday-night/events/list', { method: 'GET' });

        if (eventsRes?.success && eventsRes.data) {
          setAllUpcoming(eventsRes.data.upComing || []);
          setAllPast(eventsRes.data.pastEvents || []);
        }

        // 2. Fetch user-specific registrations & watched
        const userRes = await apiRequest<{
          success: boolean;
          data: UserEventData;
        }>('/api/members/retrieve/thursday-night/user-events/data/list', { method: 'GET' });

        if (userRes?.success && userRes.data) {
          setRegisteredIds(new Set(userRes.data.upcoming || []));
          // If backend sends watched/past watched events:
          if (userRes.data.pastEvents) {
            setWatchedIds(new Set(userRes.data.pastEvents));
          }
          // If watched comes in separate field, add: setWatchedIds(new Set(res.watched || []))
        }
      } catch (err) {
        console.error('Failed to load Thursday Night data:', err);
        setError('Unable to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Optional: function to handle registration (stub - implement POST later)
  const handleRegister = async (eventId: string) => {
    // TODO: POST to /api/register/thursday-night/{eventId}
    // On success: add to registeredIds
    alert(`Registering for event ${eventId}... (implement API call)`);
  };

  const handleWatch = (eventId: string, isWatched: boolean) => {
    // TODO: link to video or mark as watched
    alert(`${isWatched ? 'Rewatch' : 'Watch'} event ${eventId} (implement player)`);
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
            <div className="text-center max-w-md">
              <p className="text-destructive text-lg mb-2">Error</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
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
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                Thursday Night at the Rite
              </h1>
              <p className="text-muted-foreground">
                Bi-weekly online degree presentations for Scottish Rite members
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6 bg-card text-center">
                <Users className="text-primary mx-auto mb-3" size={32} />
                <p className="text-3xl font-bold">1,000+</p>
                <p className="text-sm text-muted-foreground mt-1">Members Joined Since 2020</p>
              </div>
              <div className="border rounded-lg p-6 bg-card text-center">
                <Video className="text-primary mx-auto mb-3" size={32} />
                <p className="text-3xl font-bold">29</p>
                <p className="text-sm text-muted-foreground mt-1">Degrees Available</p>
              </div>
              <div className="border rounded-lg p-6 bg-card text-center">
                <Calendar className="text-primary mx-auto mb-3" size={32} />
                <p className="text-3xl font-bold">Bi-Weekly</p>
                <p className="text-sm text-muted-foreground mt-1">Every Other Thursday</p>
              </div>
            </div>

            {/* Upcoming Presentations */}
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-heading text-lg font-semibold mb-5 flex items-center gap-3">
                <Calendar className="text-primary" size={20} />
                Upcoming Presentations
              </h3>

              {allUpcoming.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming events scheduled at this time.
                </p>
              ) : (
                <div className="space-y-4">
                  {allUpcoming.map((event) => {
                    const isRegistered = registeredIds.has(event.id);
                    return (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/40 rounded-lg border"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center shrink-0">
                            <span className="font-heading font-bold text-primary-foreground text-xl">
                              {event.degree}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{event.name}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {event.date}
                              </span>
                              {event.time && (
                                <span className="flex items-center gap-1.5">
                                  <Clock size={14} />
                                  {event.time}
                                </span>
                              )}
                              {event.going !== undefined && (
                                <span>{event.going} going</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium whitespace-nowrap">
                            <CheckCircle size={16} />
                            Registered
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRegister(event.id)}
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

            {/* Past Presentations */}
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-heading text-lg font-semibold mb-5 flex items-center gap-3">
                <Video className="text-primary" size={20} />
                Past Presentations
              </h3>

              {allPast.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No past events available yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {allPast.map((event) => {
                    const isWatched = watchedIds.has(event.id);
                    return (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <span className="font-heading font-semibold text-foreground text-lg">
                              {event.degree}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{event.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWatch(event.id, isWatched)}
                        >
                          <Play size={14} className="mr-2" />
                          {isWatched ? 'Rewatch' : 'Watch'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button variant="outline" className="w-full mt-6">
                View All Past Presentations
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ThursdayNight;