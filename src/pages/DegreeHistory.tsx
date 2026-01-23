import { useEffect, useState } from 'react';
import { Award, Calendar, CheckCircle, Loader2, Video } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import apiRequest from '@/utils/api';

interface Degree {
  number: number;
  name: string;
  witnessed: boolean;
  date?: string | null;     // ISO date or formatted string
  method?: string | null;   // e.g. "In Person", "TNR", "Online", etc.
}

const DegreeHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [witnessedCount, setWitnessedCount] = useState(0);

  useEffect(() => {
    const fetchDegreeHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiRequest<{
          success: boolean;
          degrees: Degree[];
        }>('/api/retrieve/my-degrees/data/history', {
          method: 'GET',
        });
        
        if (res.success && Array.isArray(res.degrees)) {
          setDegrees(res.degrees);

          const count = res.degrees.filter(d => d.witnessed).length;
          setWitnessedCount(count);
        } else {
          setError('No degree history data received from server.');
        }
      } catch (err) {
        console.error('Failed to fetch degree history:', err);
        setError('Could not load your degree history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDegreeHistory();
  }, []);

  const totalDegrees = degrees.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your degree history...</p>
        </div>
      </div>
    );
  }

  if (error || totalDegrees === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center max-w-md">
              <p className="text-destructive text-lg mb-2">Error</p>
              <p className="text-muted-foreground">
                {error || 'No degrees found in your record.'}
              </p>
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
                My Degree History
              </h1>
              <p className="text-muted-foreground">
                Track your journey through the Scottish Rite degrees
              </p>
            </div>

            {/* Progress Summary */}
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="text-primary" size={24} />
                  <div>
                    <h2 className="font-semibold text-lg">Degrees Witnessed</h2>
                    <p className="text-sm text-muted-foreground">
                      Your progress in the Scottish Rite
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">{witnessedCount}</span>
                  <span className="text-2xl text-muted-foreground"> / {totalDegrees}</span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${totalDegrees ? (witnessedCount / totalDegrees) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* TNR Info Box */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-5 flex items-start gap-4">
              <Video className="text-accent mt-1" size={20} />
              <div>
                <p className="font-medium text-foreground mb-1">Thursday Night at the Rite (TNR)</p>
                <p className="text-sm text-muted-foreground">
                  When you witness a degree online through TNR, your record is automatically updated in Journey 365.
                </p>
              </div>
            </div>

            {/* Degree List */}
            <div className="space-y-4">
              {degrees.map((degree, index) => (
                <div
                  key={degree.number}
                  className={`border rounded-lg p-5 bg-card transition-all animate-fade-in ${
                    degree.witnessed ? 'border-l-4 border-l-primary' : ''
                  }`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                        degree.witnessed
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {degree.witnessed ? (
                        <CheckCircle size={28} />
                      ) : (
                        <span className="text-xl font-bold">{degree.number}°</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {degree.number}° - {degree.name}
                      </h3>

                      {degree.witnessed ? (
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {degree.date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              {degree.date}
                            </span>
                          )}
                          {degree.method && (
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {degree.method}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          Not yet witnessed
                        </p>
                      )}
                    </div>

                    {degree.witnessed && (
                      <CheckCircle className="text-primary hidden sm:block" size={24} />
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