import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import SanitationServices from "@/pages/SanitationServices";
import InspectionsIndex from "@/pages/Inspections/Index";
import InspectionDetails from "@/pages/Inspections/Details";
import InspectionsNew from "@/pages/Inspections/New";
import Signup from "@/pages/Auth/Signup";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import { AuthProvider, RequireAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Routes that use the main application layout */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                <Route path="/sanitation-services" element={<RequireAuth><SanitationServices /></RequireAuth>} />
                <Route path="/inspections" element={<RequireAuth><InspectionsIndex /></RequireAuth>} />
                <Route path="/inspections/new" element={<RequireAuth><InspectionsNew /></RequireAuth>} />
                <Route path="/inspections/:id" element={<RequireAuth><InspectionDetails /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
              </Route>

              {/* Public / standalone routes (no AppLayout) */}
              <Route path="/signup" element={<Signup />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
