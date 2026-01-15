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
import MailingPreferences from "./pages/MailingPreferences";
import MyTickets from "./pages/MyTickets";
import CreateTicket from "./pages/CreateTicket";
import ValleyOfExcellence from "./pages/ValleyOfExcellence";
import MyAchievements from "./pages/MyAchievements";
import Notifications from "./pages/Notifications";
import PaypalSuccess from "./pages/PaypalSuccess";
import PaypalCancel from "./pages/PaypalCancel";
import NotFound from "./pages/NotFound";
import ChatSupport from "./components/ChatSupport";
import SessionExpiredProvider from "./components/SessionExpiredProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionExpiredProvider loginUrl="/login">
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
            <Route path="/mailing-preferences" element={<MailingPreferences />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/valley-of-excellence" element={<ValleyOfExcellence />} />
            <Route path="/my-achievements" element={<MyAchievements />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/paypal/success" element={<PaypalSuccess />} />
            <Route path="/paypal/cancel" element={<PaypalCancel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatSupport />
        </BrowserRouter>
      </SessionExpiredProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
