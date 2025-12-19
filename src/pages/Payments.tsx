import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { CreditCard, Calendar, CheckCircle, Clock, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const paymentHistory = [
  { id: 1, description: "Annual Dues 2024", amount: 150.00, date: "Jan 15, 2024", status: "paid" },
  { id: 2, description: "Annual Dues 2023", amount: 145.00, date: "Jan 12, 2023", status: "paid" },
  { id: 3, description: "Valley Event Fee", amount: 35.00, date: "Oct 5, 2023", status: "paid" },
  { id: 4, description: "Annual Dues 2022", amount: 140.00, date: "Jan 20, 2022", status: "paid" },
];

const Payments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const duesStatus = "current"; // could be "current", "due", or "overdue"

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Payments</h1>
              <p className="text-muted-foreground">Manage your dues and financial transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dues Status Card */}
              <div className="progress-card animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold">Dues Status</h2>
                    <p className="text-sm text-muted-foreground">2024 Membership</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-primary" size={20} />
                  <span className="font-medium text-primary">Current</span>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Paid: January 15, 2024</p>
                  <p>Next Due: January 1, 2025</p>
                </div>
              </div>

              {/* Quick Pay Card */}
              <div className="lg:col-span-2 progress-card animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="text-primary" size={20} />
                  Pay Your Dues
                </h3>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">2025 Annual Dues</span>
                    <span className="font-heading text-xl font-bold">$155.00</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Due by January 1, 2025</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="flex-1 min-w-[150px]">
                    <CreditCard size={16} className="mr-2" />
                    Pay Now
                  </Button>
                  <Button variant="outline" className="flex-1 min-w-[150px]">
                    <Calendar size={16} className="mr-2" />
                    Set Up Auto-Pay
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="progress-card mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                Payment History
              </h3>
              
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div 
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-semibold text-foreground">${payment.amount.toFixed(2)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;
