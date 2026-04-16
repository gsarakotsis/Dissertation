import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (user?.role === 'admin' || user?.role === 'cc_organizer') return '/dashboard'
    if (user?.role === 'external_organizer') return '/external-dashboard'
    return '/profile'
  }

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return 'Admin Dashboard'
    if (user?.role === 'cc_organizer') return 'Dashboard'
    if (user?.role === 'external_organizer') return 'My Dashboard'
    return 'My Profile'
  }

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '2px solid #f5f5f5',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', fontSize: '32px', fontWeight: '700' }}>
          <span style={{ color: '#1a1a1a' }}>Event</span>
          <span style={{ color: '#ff6b35' }}>Hub</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '40px' }}>
          <Link to="/" style={{
            color: '#1a1a1a', textDecoration: 'none',
            fontSize: '18px', fontWeight: '600'
          }}>Home</Link>
          <Link to="/events" style={{
            color: '#1a1a1a', textDecoration: 'none',
            fontSize: '18px', fontWeight: '600'
          }}>Events</Link>
          <Link to="/about" style={{
            color: '#1a1a1a', textDecoration: 'none',
            fontSize: '18px', fontWeight: '600'
          }}>About</Link>
        </nav>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: '15px', color: '#666', fontWeight: '600' }}>
                {user.fullName}
              </span>
              <Link to={getDashboardLink()} style={{
                color: '#1a1a1a',
                backgroundColor: 'transparent',
                border: '2px solid #1a1a1a',
                padding: '10px 25px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}>
                {getDashboardLabel()}
              </Link>
              <button onClick={handleLogout} style={{
                backgroundColor: '#ff6b35',
                color: '#ffffff',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#1a1a1a',
                backgroundColor: 'transparent',
                border: '2px solid #1a1a1a',
                padding: '10px 25px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none'
              }}>Login</Link>
              <Link to="/register" style={{
                backgroundColor: '#ff6b35',
                color: '#ffffff',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
              }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header