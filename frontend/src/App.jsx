import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/admin/DashboardPage'
import EventFormPage from './pages/EventFormPage'
import ExternalDashboardPage from './pages/ExternalDashboardPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import ArchivePage from './pages/ArchivePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/archive" element={<ArchivePage />} />

        <Route element={<ProtectedRoute roles={['admin', 'cc_organizer']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin', 'cc_organizer', 'external_organizer']} />}>
          <Route path="/event-form" element={<EventFormPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['external_organizer']} />}>
          <Route path="/external-dashboard" element={<ExternalDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App