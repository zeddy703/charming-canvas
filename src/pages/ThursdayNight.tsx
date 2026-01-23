import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Video, Calendar, Clock, Users, Play, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  { id: 1, degree: "7°", name: "Provost and Judge", date: "December 26, 2024", time: "7:00 PM EST", registered: true },
  { id: 2, degree: "10°", name: "Master Elect", date: "January 9, 2025", time: "7:00 PM EST", registered: false },
  { id: 3, degree: "12°", name: "Grand Master Architect", date: "January 23, 2025", time: "7:00 PM EST", registered: false },
];

const pastEvents = [
  { id: 1, degree: "6°", name: "Master of the Brazen Serpent", date: "December 12, 2024", watched: true },
  { id: 2, degree: "11°", name: "Sublime Master Elected", date: "November 28, 2024", watched: true },
  { id: 3, degree: "4°", name: "Secret Master", date: "November 14, 2024", watched: false },
];

const ThursdayNight = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                        <span className="font-heading font-bold text-primary-foreground text-lg">{event.degree}</span>
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-foreground">{event.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    {event.registered ? (
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={14} />
                        Registered
                      </span>
                    ) : (
                      <Button size="sm">Register</Button>
                    )}
                  </div>
                ))}
              </div>
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

      {/* Registration Dialog */}
      {selectedEvent && (
        <EventRegistrationDialog
          isOpen={registrationDialogOpen}
          onClose={() => {
            setRegistrationDialogOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default ThursdayNight;