import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../services/api'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [pendingEvents, setPendingEvents] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'cc_organizer')) {
      navigate('/')
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [eventsRes, usersRes] = await Promise.all([
        API.get('/events/my-events'),
        user?.role === 'admin' ? API.get('/users') : Promise.resolve({ data: [] })
      ])
      setEvents(eventsRes.data)
      setUsers(usersRes.data)
      setPendingEvents(eventsRes.data.filter(e => e.status === 'pending'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleApprove = async (eventId) => {
    try {
      await API.patch(`/events/${eventId}/approve`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (eventId) => {
    try {
      await API.patch(`/events/${eventId}/reject`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await API.delete(`/events/${eventId}`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await API.delete(`/users/${userId}`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const sidebarItems = [
    { key: 'overview', label: 'Dashboard' },
    { key: 'events', label: 'All Events' },
    { key: 'pending', label: `Pending Approvals ${pendingEvents.length > 0 ? `(${pendingEvents.length})` : ''}` },
    ...(user?.role === 'admin' ? [{ key: 'users', label: 'Users' }] : []),
  ]

  const statusColor = (status) => {
    const colors = {
      published: { bg: '#e8f5e9', color: '#2e7d32' },
      pending: { bg: '#fff3e0', color: '#e65100' },
      rejected: { bg: '#fff0f0', color: '#f44336' },
      draft: { bg: '#f5f5f5', color: '#666' },
      cancelled: { bg: '#fce4ec', color: '#c62828' },
    }
    return colors[status] || { bg: '#f5f5f5', color: '#666' }
  }

  const roleColor = (role) => {
    const colors = {
      admin: '#ff6b35',
      cc_organizer: '#2196f3',
      external_organizer: '#9c27b0',
      visitor: '#4caf50',
    }
    return colors[role] || '#888'
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>

      {/* Top Bar */}
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '28px', fontWeight: '700' }}>
          <span style={{ color: '#ffffff' }}>Event</span>
          <span style={{ color: '#ff6b35' }}>Hub</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '15px', color: '#d0d0d0' }}>{user?.fullName}</span>
          <button onClick={handleLogout} style={{
            backgroundColor: '#ff6b35',
            color: '#ffffff',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 58px)' }}>

        {/* Sidebar */}
        <aside style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '2px solid #f0f0f0',
          padding: '30px 0'
        }}>
          <div style={{ padding: '0 25px', marginBottom: '30px' }}>
            <Link to="/dashboard/create-event" style={{
              display: 'block',
              backgroundColor: '#ff6b35',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '15px',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              + Create Event
            </Link>
          </div>
          {sidebarItems.map(item => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                padding: '12px 25px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === item.key ? '#ff6b35' : 'transparent',
                color: activeTab === item.key ? '#ffffff' : '#666',
                borderRight: activeTab === item.key ? '4px solid #e55a2b' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '40px', backgroundColor: '#f5f5f5' }}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>Admin Dashboard</h1>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '35px' }}>Manage events, users, and system settings</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
                {[
                  { label: 'Total Events', value: events.length },
                  { label: 'Total Users', value: users.length },
                  { label: 'Pending Approvals', value: pendingEvents.length },
                  { label: 'Published Events', value: events.filter(e => e.status === 'published').length },
                ].map(stat => (
                  <div key={stat.label} style={{
                    backgroundColor: '#ffffff',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>All Events</h2>
              {loading ? <p>Loading...</p> : events.length === 0 ? (
                <p style={{ color: '#666' }}>No events yet. <Link to="/dashboard/create-event" style={{ color: '#ff6b35' }}>Create one!</Link></p>
              ) : (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  {events.map(event => (
                    <div key={event._id} style={{
                      padding: '20px 25px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>{event.title}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{formatDate(event.eventDate)} • {event.eventType}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: statusColor(event.status).bg,
                          color: statusColor(event.status).color
                        }}>
                          {event.status}
                        </span>
                        <Link to={`/events/${event._id}`} style={{
                          padding: '6px 16px',
                          border: '2px solid #1a1a1a',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          color: '#1a1a1a'
                        }}>View</Link>
                        <button onClick={() => handleDeleteEvent(event._id)} style={{
                          padding: '6px 16px',
                          border: '2px solid #f44336',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#f44336',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Tab */}
          {activeTab === 'pending' && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>Pending Approvals</h2>
              {pendingEvents.length === 0 ? (
                <p style={{ color: '#666' }}>No pending events.</p>
              ) : (
                pendingEvents.map(event => (
                  <div key={event._id} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '25px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{event.title}</div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                          {formatDate(event.eventDate)} • {event.eventType}
                        </div>
                        <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>{event.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                        <button onClick={() => handleApprove(event._id)} style={{
                          padding: '10px 25px',
                          backgroundColor: '#4caf50',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>Approve</button>
                        <button onClick={() => handleReject(event._id)} style={{
                          padding: '10px 25px',
                          backgroundColor: '#f44336',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>Reject</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && user?.role === 'admin' && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>Users</h2>
              {users.length === 0 ? <p style={{ color: '#666' }}>No users found.</p> : (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  {users.map(u => (
                    <div key={u._id} style={{
                      padding: '20px 25px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>{u.fullName}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{u.email}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: roleColor(u.role),
                          color: '#ffffff'
                        }}>
                          {u.role}
                        </span>
                        {u._id !== user._id && (
                          <button onClick={() => handleDeleteUser(u._id)} style={{
                            padding: '6px 16px',
                            border: '2px solid #f44336',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#f44336',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                          }}>Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default DashboardPage