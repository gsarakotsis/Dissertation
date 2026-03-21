import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/admin/DashboardPage'
import CreateEventPage from './pages/admin/CreateEventPage'
import ExternalDashboardPage from './pages/ExternalDashboardPage'
import ProposeEventPage from './pages/ProposeEventPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute roles={['admin', 'cc_organizer']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/create-event" element={<CreateEventPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['external_organizer']} />}>
          <Route path="/external-dashboard" element={<ExternalDashboardPage />} />
          <Route path="/propose-event" element={<ProposeEventPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App