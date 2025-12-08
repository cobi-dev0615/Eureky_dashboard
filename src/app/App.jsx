import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/layout/Layout';
import Dashboard from '../features/dashboard';
import Lists from '../features/lists';
import Calendar from '../features/calendar';
import CalendarCallback from '../features/calendar/CalendarCallback';
import Settings from '../features/settings';
import Next7Days from '../features/next7days';
import Register from '../features/auth';
import Login from '../features/auth/Login';
import Landing from '../features/landing';
import { TermsAndConditions } from '../features/terms';
import { PrivacyPolicy } from '../features/privacy';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import QueryProvider from './providers/QueryProvider';
import { AppProvider } from '../shared/contexts/AppContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Checkout from '@/features/checkout';

function App() {
  return (
    <QueryProvider>
      <AppProvider>
        <TooltipProvider>
          <ThemeSwitcher className="hidden" />
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/next7days" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Next7Days />} />
              </Route>
              <Route path="/dashboard/lists" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Lists />} />
              </Route>

              <Route path="/dashboard/calendar" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Calendar />} />
              </Route>

              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Settings />} />
              </Route>

              <Route path="/calendar/callback" element={
                <ProtectedRoute>
                  <CalendarCallback />
                </ProtectedRoute>
              } />
              <Route path="/payments/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Landing to="/dashboard" replace />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              <Route path="*" element={<Landing to="/dashboard" replace />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AppProvider>
    </QueryProvider>
  );
}

export default App
