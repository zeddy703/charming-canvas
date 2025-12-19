import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProgressTracker from '@/components/ProgressTracker';
import WaypointTracker from '@/components/WaypointTracker';
import PathfinderInfo from '@/components/PathfinderInfo';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <ProgressTracker />
                <WaypointTracker />
              </div>

              {/* Right Column */}
              <div>
                <PathfinderInfo />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
