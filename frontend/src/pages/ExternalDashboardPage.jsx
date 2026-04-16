import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

const ExternalDashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user || user.role !== 'external_organizer') {
      navigate('/')
    }
    fetchEvents()
  }, [user])

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events/my-events')
      setEvents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return
    try {
      await API.delete(`/events/${eventId}`)
      fetchEvents()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

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

  const sidebarItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'proposals', label: 'My Proposals' },
  ]

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
            <Link to="/event-form" style={{
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
              + Propose Event
            </Link>
          </div>
          {sidebarItems.map(item => (
            <div key={item.key} onClick={() => setActiveTab(item.key)} style={{
              padding: '12px 25px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === item.key ? '#ff6b35' : 'transparent',
              color: activeTab === item.key ? '#ffffff' : '#666',
              borderRight: activeTab === item.key ? '4px solid #e55a2b' : 'none',
              transition: 'all 0.2s'
            }}>
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '40px', backgroundColor: '#f5f5f5' }}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
                Welcome, {user?.fullName}
              </h1>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '35px' }}>
                External Event Organizer Dashboard
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '25px',
                marginBottom: '40px'
              }}>
                {[
                  { label: 'Total Proposals', value: events.length },
                  { label: 'Pending', value: events.filter(e => e.status === 'pending').length },
                  { label: 'Approved', value: events.filter(e => e.status === 'published').length },
                ].map(stat => (
                  <div key={stat.label} style={{
                    backgroundColor: '#ffffff',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      fontSize: '13px', color: '#888', fontWeight: '600',
                      textTransform: 'uppercase', marginBottom: '10px'
                    }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Company Info */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
                  Organization Info
                </h2>
                {[
                  { label: 'Full Name', value: user?.fullName },
                  { label: 'Email', value: user?.email },
                  { label: 'Company', value: user?.companyName || 'Not specified' },
                  { label: 'Website', value: user?.companyUrl || 'Not specified' },
                  { label: 'Position', value: user?.position || 'Not specified' },
                  { label: 'Phone', value: user?.phoneNumber || 'Not specified' },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span style={{ fontSize: '15px', color: '#888', fontWeight: '600' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '600' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === 'proposals' && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>
                My Proposals
              </h2>

              {loading ? (
                <p style={{ color: '#666' }}>Loading...</p>
              ) : events.length === 0 ? (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '50px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    No proposals yet.
                  </p>
                  <Link to="/event-form" style={{
                    backgroundColor: '#ff6b35',
                    color: '#ffffff',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '15px',
                    textDecoration: 'none'
                  }}>
                    Submit your first proposal
                  </Link>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {events.map(event => (
                    <div key={event._id} style={{
                      padding: '20px 25px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '16px', fontWeight: '700', marginBottom: '5px'
                        }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {formatDate(event.eventDate)} • {event.eventType}
                        </div>
                        {event.status === 'rejected' && event.rejectionReason && (
                          <div style={{
                            fontSize: '13px', color: '#f44336',
                            marginTop: '5px'
                          }}>
                            Reason: {event.rejectionReason}
                          </div>
                        )}
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
                        {(event.status === 'pending' || event.status === 'draft') && (
                          <button onClick={() => handleDelete(event._id)} style={{
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

export default ExternalDashboardPage