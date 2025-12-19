import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MilestoneDetail from "./pages/MilestoneDetail";
import DegreeHistory from "./pages/DegreeHistory";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";
import ThursdayNight from "./pages/ThursdayNight";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/milestone/:id" element={<MilestoneDetail />} />
          <Route path="/degree-history" element={<DegreeHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/thursday-night" element={<ThursdayNight />} />
          <Route path="/contacts" element={<Contacts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
