import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layout/AuthLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import { Overview } from './pages/Dashboard/Overview';
import { MeetingList } from './pages/Meetings/MeetingList';
import { MeetingDetails } from './pages/Meetings/MeetingDetails';
import { AIAssistant } from './pages/AI/AIAssistant';
import { DocumentManager } from './pages/Documents/DocumentManager';
import { CalendarView } from './pages/Calendar/CalendarView';
import { OrganizationSettings } from './pages/Organization/OrganizationSettings';
import { ProfileSettings } from './pages/Settings/ProfileSettings';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

          {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="meetings" element={<MeetingList />} />
          <Route path="meetings/:id" element={<MeetingDetails />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="documents" element={<DocumentManager />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="analytics" element={<div className="p-4">Analytics Coming Soon</div>} />
          <Route path="organization" element={<OrganizationSettings />} />
          <Route path="settings" element={<OrganizationSettings />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
