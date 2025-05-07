
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProjectsPage from '@/pages/ProjectsPage';
import RecordsListPage from '@/pages/RecordsListPage';
import RecordFormPage from '@/pages/RecordFormPage';
import RecordDetailPage from '@/pages/RecordDetailPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/NotFound';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectsPage />} />
            <Route path="/records" element={<RecordsListPage />} />
            <Route path="/records/new" element={<RecordFormPage />} />
            <Route path="/records/:id" element={<RecordDetailPage />} />
            <Route path="/records/edit/:id" element={<RecordFormPage />} />
            <Route path="/records/duplicate/:id" element={<RecordFormPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
