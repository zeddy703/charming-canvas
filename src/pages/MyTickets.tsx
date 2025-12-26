import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Ticket, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const tickets = [
  {
    id: 'TKT-001',
    subject: 'Degree Certificate Request',
    status: 'open',
    priority: 'medium',
    created: 'Dec 20, 2024',
    lastUpdate: 'Dec 22, 2024',
    replies: 2,
  },
  {
    id: 'TKT-002',
    subject: 'Update Mailing Address',
    status: 'resolved',
    priority: 'low',
    created: 'Dec 10, 2024',
    lastUpdate: 'Dec 12, 2024',
    replies: 3,
  },
  {
    id: 'TKT-003',
    subject: 'Payment Issue - Dues 2024',
    status: 'pending',
    priority: 'high',
    created: 'Dec 5, 2024',
    lastUpdate: 'Dec 8, 2024',
    replies: 1,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case 'resolved':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'medium':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'low':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open':
      return <Clock size={16} />;
    case 'pending':
      return <AlertCircle size={16} />;
    case 'resolved':
      return <CheckCircle size={16} />;
    default:
      return <Ticket size={16} />;
  }
};

const MyTickets = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Tickets</h1>
                <p className="text-muted-foreground">View and manage your support requests</p>
              </div>
              <Link to="/create-ticket">
                <Button>
                  <Ticket size={16} className="mr-2" />
                  Create New Ticket
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="progress-card animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Open</p>
                  </div>
                </div>
              </div>
              <div className="progress-card animate-fade-in" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
              <div className="progress-card animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="progress-card animate-fade-in" style={{ animationDelay: '150ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Ticket className="text-primary" size={20} />
                All Tickets
              </h3>

              <div className="space-y-3">
                {tickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">{ticket.status}</span>
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground">{ticket.subject}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Created: {ticket.created}</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {ticket.replies} replies
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTickets;
