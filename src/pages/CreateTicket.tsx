import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Ticket, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "@/utils/api";

const CreateTicket = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
  });

  /* -------------------- Validation -------------------- */
  const validateForm = () => {
    if (!formData.subject.trim()) return "Subject is required";
    if (!formData.category) return "Category is required";
    if (!formData.priority) return "Priority is required";
    if (!formData.description.trim()) return "Description is required";
    if (formData.description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }
    return null;
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        subject: formData.subject.trim(),
        category: formData.category,
        priority: formData.priority,
        description: formData.description.trim(),
      };

      const response = await apiRequest(
        "/api/tickets/user/add/ticket_report",{
          method:"POST",
          body:payload
        }
      );

      if (!response?.success) {
        throw new Error(response?.error || "Failed to submit ticket");
      }

      toast({
        title: "Ticket Created",
        description:
          "Your support ticket has been submitted successfully. We'll respond within 24–48 hours.",
          variant: "success"
      });

      navigate("/my-tickets");
    } catch (err: any) {
      //console.log(Response)
      toast({
        title: err?.title || "Submission Failed",
        description:
          err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <div className="max-w-2xl mx-auto">
            {/* Back */}
            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to My Tickets
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold mb-2">
                Create New Ticket
              </h1>
              <p className="text-muted-foreground">
                Submit a support request and we’ll get back to you soon
              </p>
            </div>

            {/* Form */}
            <div className="progress-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="font-semibold">Support Request</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="payments">Payments & Dues</SelectItem>
                        <SelectItem value="degrees">
                          Degrees & Certificates
                        </SelectItem>
                        <SelectItem value="events">Events & TNR</SelectItem>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Low – General inquiry
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium – Need help soon
                        </SelectItem>
                        <SelectItem value="high">High – Urgent issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    className="min-h-[150px]"
                    placeholder="Please provide as much detail as possible..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    <Send size={16} className="mr-2" />
                    {loading ? "Submitting..." : "Submit Ticket"}
                  </Button>

                  <Link to="/my-tickets" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Response Time:</strong> We typically respond within
                24–48 hours during business days.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTicket;
