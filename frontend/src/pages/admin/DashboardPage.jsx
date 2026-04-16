import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../services/api'

const DashboardPage = () => {
  const [attendeesModal, setAttendeesModal] = useState({ open: false, eventTitle: '', attendees: [] })
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [locations, setLocations] = useState([])
  const [pendingEvents, setPendingEvents] = useState([])
  const [allFeedback, setAllFeedback] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationForm, setLocationForm] = useState({
    buildingName: '',
    roomNumber: '',
    roomName: '',
    floor: '',
    capacity: '',
    roomType: 'classroom',
    accessibility: false
  })
  const [rejectModal, setRejectModal] = useState({ open: false, eventId: null, reason: '' })

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'cc_organizer')) {
      navigate('/')
    }
    fetchData()
  }, [user])


  const handleViewAttendees = async (event) => {
    try {
      const { data } = await API.get(`/registrations/event/${event._id}`)
      setAttendeesModal({ open: true, eventTitle: event.title, attendees: data })
    } catch (err) {
      console.error(err)
    }
  }
  const fetchData = async () => {
    try {
      const [eventsRes, usersRes, locationsRes] = await Promise.all([
        API.get('/events/my-events'),
        user?.role === 'admin' ? API.get('/users') : Promise.resolve({ data: [] }),
        API.get('/locations')
      ])
      setEvents(eventsRes.data)
      setUsers(usersRes.data)
      setLocations(locationsRes.data)
      setPendingEvents(eventsRes.data.filter(e => e.status === 'pending'))

      if (eventsRes.data.length > 0) {
        const feedbackPromises = eventsRes.data.map(e =>
          API.get(`/feedback/event/${e._id}`)
            .then(res => ({ eventTitle: e.title, eventId: e._id, ...res.data }))
            .catch(() => null)
        )
        const feedbackResults = await Promise.all(feedbackPromises)
        setAllFeedback(feedbackResults.filter(f => f && f.total > 0))
      }
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

  const handleReject = async () => {
    try {
      await API.patch(`/events/${rejectModal.eventId}/reject`, { reason: rejectModal.reason })
      setRejectModal({ open: false, eventId: null, reason: '' })
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

  const handleLocationChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setLocationForm({ ...locationForm, [e.target.name]: value })
  }

  const handleCreateLocation = async (e) => {
    e.preventDefault()
    setLocationError('')
    setLocationLoading(true)
    try {
      await API.post('/locations', locationForm)
      setLocationForm({
        buildingName: '', roomNumber: '', roomName: '',
        floor: '', capacity: '', roomType: 'classroom', accessibility: false
      })
      setShowLocationForm(false)
      fetchData()
    } catch (err) {
      setLocationError(err.response?.data?.message || 'Failed to create location.')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Deactivate this location?')) return
    try {
      await API.delete(`/locations/${locationId}`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
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

  const roleColor = (role) => {
    const colors = {
      admin: '#ff6b35',
      cc_organizer: '#2196f3',
      external_organizer: '#9c27b0',
      visitor: '#4caf50',
    }
    return colors[role] || '#888'
  }

  const sidebarItems = [
    { key: 'overview', label: 'Dashboard' },
    { key: 'events', label: 'All Events' },
    { key: 'pending', label: `Pending Approvals ${pendingEvents.length > 0 ? `(${pendingEvents.length})` : ''}` },
    ...(user?.role === 'admin' ? [
      { key: 'users', label: 'Users' },
      { key: 'locations', label: 'Locations' },
      { key: 'feedback', label: 'Reviews' },
    ] : []),
  ]

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff'
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
              + Create Event
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
                Admin Dashboard
              </h1>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '35px' }}>
                Manage events, users, and system settings
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '25px',
                marginBottom: '40px'
              }}>
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
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>All Events</h2>
              {loading ? <p>Loading...</p> : events.length === 0 ? (
                <p style={{ color: '#666' }}>
                  No events yet.{' '}
                  <Link to="/event-form" style={{ color: '#ff6b35' }}>Create one!</Link>
                </p>
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
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {formatDate(event.eventDate)} • {event.eventType}
                        </div>
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

                        <button onClick={() => handleViewAttendees(event)} style={{
                          padding: '6px 16px',
                          border: '2px solid #ff6b35',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#ff6b35',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}>Attendees</button>
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
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>
                Pending Approvals
              </h2>
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
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                          {formatDate(event.eventDate)} • {event.eventType}
                        </div>
                        <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                          {event.description}
                        </p>
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
                        <button onClick={() => setRejectModal({ open: true, eventId: event._id, reason: '' })} style={{
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
              {users.length === 0 ? (
                <p style={{ color: '#666' }}>No users found.</p>
              ) : (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {users.map(u => (
                    <div key={u._id} style={{
                      padding: '20px 25px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>
                          {u.fullName}
                        </div>
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

          {/* Locations Tab */}
          {activeTab === 'locations' && user?.role === 'admin' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700' }}>Locations</h2>
                <button onClick={() => setShowLocationForm(!showLocationForm)} style={{
                  backgroundColor: '#ff6b35',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}>
                  {showLocationForm ? 'Cancel' : '+ Add Location'}
                </button>
              </div>

              {showLocationForm && (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '30px',
                  marginBottom: '25px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '25px' }}>
                    New Location
                  </h3>

                  {locationError && (
                    <div style={{
                      backgroundColor: '#fff0f0',
                      border: '1px solid #f44336',
                      color: '#f44336',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '14px'
                    }}>
                      {locationError}
                    </div>
                  )}

                  <form onSubmit={handleCreateLocation}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                          Building Name *
                        </label>
                        <input name="buildingName" type="text" value={locationForm.buildingName}
                          onChange={handleLocationChange} placeholder="e.g. Main Building"
                          required style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                          Room Number *
                        </label>
                        <input name="roomNumber" type="text" value={locationForm.roomNumber}
                          onChange={handleLocationChange} placeholder="e.g. 301"
                          required style={inputStyle} />
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                          Room Name
                        </label>
                        <input name="roomName" type="text" value={locationForm.roomName}
                          onChange={handleLocationChange} placeholder="e.g. Computer Lab"
                          style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                          Capacity *
                        </label>
                        <input name="capacity" type="number" value={locationForm.capacity}
                          onChange={handleLocationChange} placeholder="e.g. 50"
                          required min="1" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                          Room Type
                        </label>
                        <select name="roomType" value={locationForm.roomType}
                          onChange={handleLocationChange} style={inputStyle}>
                          <option value="classroom">Classroom</option>
                          <option value="lab">Lab</option>
                          <option value="hall">Hall</option>
                          <option value="auditorium">Auditorium</option>
                          <option value="conference">Conference Room</option>
                          <option value="outdoor">Outdoor</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                          Floor
                        </label>
                        <input name="floor" type="number" value={locationForm.floor}
                          onChange={handleLocationChange} placeholder="e.g. 3"
                          style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                      <label style={{
                        display: 'flex', alignItems: 'center',
                        gap: '10px', cursor: 'pointer', fontSize: '15px'
                      }}>
                        <input name="accessibility" type="checkbox"
                          checked={locationForm.accessibility}
                          onChange={handleLocationChange}
                          style={{ width: '18px', height: '18px', accentColor: '#ff6b35' }} />
                        Wheelchair accessible
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button type="button" onClick={() => setShowLocationForm(false)} style={{
                        padding: '12px 25px',
                        backgroundColor: 'transparent',
                        border: '2px solid #1a1a1a',
                        color: '#1a1a1a',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: 'pointer'
                      }}>Cancel</button>
                      <button type="submit" disabled={locationLoading} style={{
                        padding: '12px 25px',
                        backgroundColor: locationLoading ? '#ccc' : '#ff6b35',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: locationLoading ? 'not-allowed' : 'pointer'
                      }}>
                        {locationLoading ? 'Saving...' : 'Save Location'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {locations.length === 0 ? (
                <p style={{ color: '#666' }}>No locations yet. Add one above!</p>
              ) : (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {locations.map(loc => (
                    <div key={loc._id} style={{
                      padding: '20px 25px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>
                          {loc.buildingName} - Room {loc.roomNumber}
                          {loc.roomName ? ` (${loc.roomName})` : ''}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          Capacity: {loc.capacity} • Type: {loc.roomType}
                          {loc.accessibility ? ' • Wheelchair accessible' : ''}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteLocation(loc._id)} style={{
                        padding: '6px 16px',
                        border: '2px solid #f44336',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#f44336',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}>Deactivate</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && user?.role === 'admin' && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '25px' }}>
                Reviews & Feedback
              </h2>

              {allFeedback.length === 0 ? (
                <p style={{ color: '#666' }}>No reviews yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {allFeedback.map(item => (
                    <div key={item.eventId} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '30px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: '2px solid #f5f5f5'
                      }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>
                            {item.eventTitle}
                          </div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            {item.total} review{item.total !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '36px', fontWeight: '700', color: '#ff6b35' }}>
                            {item.average}
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} style={{
                                  fontSize: '18px',
                                  color: star <= Math.round(item.average) ? '#ff6b35' : '#e0e0e0'
                                }}>★</span>
                              ))}
                            </div>
                            <div style={{ fontSize: '13px', color: '#888' }}>Average rating</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {item.feedback.map(f => (
                          <div key={f._id} style={{
                            backgroundColor: '#f5f5f5',
                            padding: '18px 20px',
                            borderRadius: '8px'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '8px'
                            }}>
                              <div style={{ fontWeight: '700', fontSize: '15px' }}>
                                {f.user?.fullName}
                              </div>
                              <div style={{ display: 'flex', gap: '3px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} style={{
                                    fontSize: '15px',
                                    color: star <= f.rating ? '#ff6b35' : '#e0e0e0'
                                  }}>★</span>
                                ))}
                              </div>
                            </div>
                            {f.comment && (
                              <p style={{
                                fontSize: '14px', color: '#666',
                                lineHeight: '1.6', margin: '0 0 8px 0'
                              }}>
                                {f.comment}
                              </p>
                            )}
                            <div style={{ fontSize: '12px', color: '#888' }}>
                              {new Date(f.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>
              Reject Event
            </h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '25px' }}>
              Please provide a reason for rejecting this event. The organizer will be notified.
            </p>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block', fontSize: '14px',
                fontWeight: '700', marginBottom: '10px', color: '#1a1a1a'
              }}>
                Reason for Rejection
              </label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="e.g. Insufficient information provided, scheduling conflict, etc."
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectModal({ open: false, eventId: null, reason: '' })} style={{
                padding: '12px 25px',
                backgroundColor: 'transparent',
                border: '2px solid #1a1a1a',
                color: '#1a1a1a',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={handleReject} style={{
                padding: '12px 25px',
                backgroundColor: '#f44336',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer'
              }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
      {/* Attendees Modal */}
      {attendeesModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px' }}>
                  Attendees
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {attendeesModal.eventTitle}
                </p>
              </div>
              <button onClick={() => setAttendeesModal({ open: false, eventTitle: '', attendees: [] })} style={{
                backgroundColor: 'transparent',
                border: '2px solid #1a1a1a',
                color: '#1a1a1a',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}>Close</button>
            </div>

            {attendeesModal.attendees.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '30px' }}>
                No attendees registered yet.
              </p>
            ) : (
              <>
                <div style={{
                  fontSize: '14px',
                  color: '#888',
                  marginBottom: '20px',
                  fontWeight: '600'
                }}>
                  {attendeesModal.attendees.length} registered attendee{attendeesModal.attendees.length !== 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {attendeesModal.attendees.map(reg => (
                    <div key={reg._id} style={{
                      backgroundColor: '#f5f5f5',
                      padding: '18px 20px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                          {reg.fullName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                          {reg.email}
                        </div>
                        {reg.phoneNumber && (
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                            {reg.phoneNumber}
                          </div>
                        )}
                        {reg.department && (
                          <div style={{ fontSize: '13px', color: '#888' }}>
                            {reg.department}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: reg.status === 'registered' ? '#e8f5e9' : '#f5f5f5',
                          color: reg.status === 'registered' ? '#2e7d32' : '#666'
                        }}>
                          {reg.status}
                        </span>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          Code: <strong style={{ color: '#ff6b35' }}>{reg.confirmationCode}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage