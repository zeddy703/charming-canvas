import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import apiRequest from "@/utils/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const TICKETS_PER_PAGE = 5;

/* -------------------- Helpers -------------------- */

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "resolved":
      return "bg-green-500/10 text-green-600 border-green-500/20";
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
      return <CheckCircle size={16} />;
    default:
      return <Ticket size={16} />;
  }
};

/* -------------------- Types -------------------- */

type TicketType = {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  repliesCount?: number;
};

/* -------------------- Component -------------------- */

const MyTickets = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  /* -------------------- Fetch Tickets -------------------- */
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setCurrentPage(1); // Reset to first page on fetch

        const res = await apiRequest("/api/tickets/user/get/ticket_report", {
          method: "GET"
        });

        if (!res?.success) {
          throw new Error(res?.error || "Failed to fetch tickets");
        }

        setTickets(res.data || []);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  /* -------------------- Stats -------------------- */
  const openCount = tickets.filter(t => t.status === "open").length;
  const pendingCount = tickets.filter(t => t.status === "pending").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved").length;

  /* -------------------- Pagination -------------------- */
  const totalPages = Math.ceil(tickets.length / TICKETS_PER_PAGE);
  const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
  const paginatedTickets = tickets.slice(startIndex, startIndex + TICKETS_PER_PAGE);

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  /* -------------------- UI -------------------- */
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-3xl font-bold mb-2">
                  My Tickets
                </h1>
                <p className="text-muted-foreground">
                  View and manage your support requests
                </p>
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
              <div className="progress-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{openCount}</p>
                    <p className="text-sm text-muted-foreground">Open</p>
                  </div>
                </div>
              </div>

              <div className="progress-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>

              <div className="progress-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{resolvedCount}</p>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="progress-card">
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Ticket className="text-primary" size={20} />
                All Tickets
              </h3>

              {loading && (
                <p className="text-sm text-muted-foreground">Loading tickets…</p>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {!loading && tickets.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You have no tickets yet.
                </p>
              )}

              <div className="space-y-3">
                {paginatedTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-muted-foreground">
                            {ticket.id}
                          </span>

                          <Badge
                            variant="outline"
                            className={getStatusColor(ticket.status)}
                          >
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">
                              {ticket.status}
                            </span>
                          </Badge>

                          <Badge
                            variant="outline"
                            className={getPriorityColor(ticket.priority)}
                          >
                            {ticket.priority}
                          </Badge>
                        </div>

                        <h4 className="font-medium">{ticket.subject}</h4>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Created:{" "}
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {ticket.repliesCount ?? 0} replies
                          </span>
                        </div>
                      </div>

                      <Link to={`/my-tickets/${ticket.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {getVisiblePages().map((page, idx) =>
                        page === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTickets;
