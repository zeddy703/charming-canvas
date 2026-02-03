import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import apiRequest from "@/utils/api";

/* -------------------- Helpers -------------------- */

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "resolved":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "closed":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "medium":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "low":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <Clock size={16} />;
    case "pending":
      return <AlertCircle size={16} />;
    case "resolved":
    case "closed":
      return <CheckCircle size={16} />;
    default:
      return <Ticket size={16} />;
  }
};

/* -------------------- Types -------------------- */

type Reply = {
  id: string;
  message: string;
  author: string;
  authorType: "user" | "support";
  createdAt: string;
};

type TicketDetail = {
  id: string;
  subject: string;
  description: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt?: string;
  replies: Reply[];
};

/* -------------------- Component -------------------- */

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiRequest(`/api/tickets/user/get/myticket/${id}`, {
          method: "GET",
        });

        if (!res?.success) {
          throw new Error(res?.error || "Failed to fetch ticket details");
        }

        setTicket(res.data);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
 
    if (id) {
      fetchTicketDetail();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/my-tickets">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft size={16} className="mr-2" />
                Back to My Tickets
              </Button>
            </Link>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                <div className="progress-card">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="progress-card">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="progress-card">
                <p className="text-red-600">{error}</p>
                <Link to="/my-tickets">
                  <Button variant="outline" className="mt-4">
                    Go Back
                  </Button>
                </Link>
              </div>
            )}

            {/* Ticket Details */}
            {ticket && !loading && (
              <div className="space-y-6">
                {/* Ticket Info Card */}
                <div className="progress-card">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-muted-foreground">
                          {ticket.id}
                        </span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(ticket.status)}
                        >
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status}</span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(ticket.priority)}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <h1 className="font-heading text-2xl font-bold">
                        {ticket.subject}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.updatedAt && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                {/* Replies Card */}
                <div className="progress-card">
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Ticket className="text-primary" size={20} />
                    Replies ({ticket.replies?.length || 0})
                  </h3>

                  {(!ticket.replies || ticket.replies.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No replies yet.
                    </p>
                  )}

                  <div className="space-y-4">
                    {ticket.replies?.map((reply, index) => (
                      <div key={reply.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div
                          className={`p-4 rounded-lg ${
                            reply.authorType === "support"
                              ? "bg-primary/5 border-l-4 border-primary"
                              : "bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                reply.authorType === "support"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <User size={16} />
                            </div>
                            <div>
                              <span className="font-medium">{reply.author}</span>
                              {reply.authorType === "support" && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  Support
                                </Badge>
                              )}
                            </div>
                            <span className="ml-auto text-sm text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {reply.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TicketDetailPage;
