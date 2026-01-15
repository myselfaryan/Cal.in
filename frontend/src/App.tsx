import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import {
  EventTypesPage,
  BookingsPage,
  AvailabilityPage,
  PublicBookingPage,
  InsightsPage,
  WorkflowsPage,
  LandingPage,
} from '@/pages';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing page - no layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Public booking page - no layout */}
          <Route path="/book/:slug" element={<PublicBookingPage />} />

          {/* Admin pages with sidebar layout */}
          <Route element={<Layout />}>
            <Route path="/event-types" element={<EventTypesPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/teams" element={<div className="p-8"><h1 className="text-2xl font-semibold">Teams</h1><p className="text-muted-foreground mt-2">Teams feature coming soon...</p></div>} />
            <Route path="/apps" element={<div className="p-8"><h1 className="text-2xl font-semibold">Apps</h1><p className="text-muted-foreground mt-2">Apps integration coming soon...</p></div>} />
            <Route path="/routing" element={<div className="p-8"><h1 className="text-2xl font-semibold">Routing</h1><p className="text-muted-foreground mt-2">Routing feature coming soon...</p></div>} />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-semibold">Settings</h1><p className="text-muted-foreground mt-2">Settings page coming soon...</p></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
