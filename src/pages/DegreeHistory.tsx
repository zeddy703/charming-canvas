import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Award, Calendar, CheckCircle, Circle, Video } from 'lucide-react';

const degrees = [
  { number: 4, name: "Secret Master", witnessed: true, date: "March 15, 2023", method: "In Person" },
  { number: 5, name: "Perfect Master", witnessed: true, date: "March 15, 2023", method: "In Person" },
  { number: 6, name: "Master of the Brazen Serpent", witnessed: true, date: "April 20, 2023", method: "TNR Online" },
  { number: 7, name: "Provost and Judge", witnessed: false, date: null, method: null },
  { number: 8, name: "Intendant of the Building", witnessed: false, date: null, method: null },
  { number: 9, name: "Master of the Temple", witnessed: true, date: "May 10, 2023", method: "In Person" },
  { number: 10, name: "Master Elect", witnessed: false, date: null, method: null },
  { number: 11, name: "Sublime Master Elected", witnessed: true, date: "June 8, 2023", method: "TNR Online" },
  { number: 12, name: "Grand Master Architect", witnessed: false, date: null, method: null },
  { number: 13, name: "Royal Arch of Solomon", witnessed: false, date: null, method: null },
  { number: 14, name: "Grand Elect Mason", witnessed: true, date: "July 20, 2023", method: "In Person" },
];

const DegreeHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const witnessedCount = degrees.filter(d => d.witnessed).length;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Degree History</h1>
              <p className="text-muted-foreground">Track your journey through the Scottish Rite degrees</p>
            </div>

            {/* Progress Summary */}
            <div className="progress-card mb-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="text-primary" size={24} />
                  <div>
                    <h2 className="font-heading text-lg font-semibold">Degrees Witnessed</h2>
                    <p className="text-sm text-muted-foreground">Your progress through the Scottish Rite</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-heading font-bold text-primary">{witnessedCount}</span>
                  <span className="text-muted-foreground">/{degrees.length}</span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${(witnessedCount / degrees.length) * 100}%` }}
                />
              </div>
            </div>

            {/* TNR Notice */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Video className="text-accent mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-foreground">Thursday Night at the Rite</p>
                <p className="text-sm text-muted-foreground">
                  When you witness a degree online through TNR, your passport is automatically updated within Journey 365.
                </p>
              </div>
            </div>

            {/* Degree List */}
            <div className="space-y-3">
              {degrees.map((degree, index) => (
                <div 
                  key={degree.number}
                  className={`waypoint-card animate-fade-in ${degree.witnessed ? 'border-l-4 border-l-primary' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      degree.witnessed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {degree.witnessed ? (
                        <CheckCircle size={24} />
                      ) : (
                        <span className="font-heading font-bold">{degree.number}°</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-foreground">
                        {degree.number}° - {degree.name}
                      </h3>
                      {degree.witnessed ? (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {degree.date}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {degree.method}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">Not yet witnessed</p>
                      )}
                    </div>
                    {degree.witnessed && (
                      <CheckCircle className="text-primary" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DegreeHistory;
