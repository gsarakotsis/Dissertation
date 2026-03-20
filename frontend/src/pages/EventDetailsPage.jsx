import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

const EventDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    dietaryRequirements: '',
    specialNeeds: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [id])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        department: user.department || ''
      }))
    }
  }, [user])

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`)
      setEvent(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setError('')
    setSuccess('')
    setRegistering(true)
    try {
      await API.post('/registrations', { eventId: id, ...formData })
      setRegistered(true)
      setSuccess('You have successfully registered for this event!')
      fetchEvent()
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const capacityPercent = event?.maxCapacity
    ? Math.min((event.currentAttendees / event.maxCapacity) * 100, 100)
    : 0

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  }

  if (loading) return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#666' }}>
        Loading event...
      </div>
      <Footer />
    </div>
  )

  if (!event) return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#666' }}>
        Event not found.
      </div>
      <Footer />
    </div>
  )

  return (
    <div>
      <Header />

      {/* Event Hero */}
      <div style={{
        width: '100%',
        height: '400px',
        background: event.photo
          ? `url(http://localhost:5000${event.photo}) center/cover`
          : 'linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)',
        position: 'relative'
      }}>
        <span style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          padding: '12px 30px',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: '700'
        }}>
          {event.eventType}
        </span>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '-80px auto 0',
        padding: '0 30px 60px',
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px'
        }}>

          {/* Left — Event Details */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '50px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              {event.title}
            </h1>

            {/* Meta */}
            <div style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '30px',
              paddingBottom: '30px',
              borderBottom: '2px solid #f5f5f5',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px' }}>Date & Time</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{formatDate(event.eventDate)} • {event.startTime} - {event.endTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px' }}>Department</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{event.department || 'N/A'}</div>
              </div>
            </div>

            {/* Description */}
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>About This Event</h2>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>
              {event.description}
            </p>

            {/* Details */}
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>Event Details</h2>
            {[
              { label: 'Location', value: event.externalLocation || (event.location ? `${event.location.buildingName} - Room ${event.location.roomNumber}` : 'TBA') },
              { label: 'Location Type', value: event.locationType === 'premises' ? 'On Campus' : 'External' },
              { label: 'Special Requirements', value: event.specialRequirements || 'None' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <span style={{ fontSize: '15px', color: '#888', fontWeight: '600' }}>{item.label}</span>
                <span style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '600' }}>{item.value}</span>
              </div>
            ))}

            {/* Organizer */}
            <div style={{
              marginTop: '40px',
              padding: '25px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Event Organizer</h2>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                {event.organizer?.fullName}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {event.organizer?.email}
              </div>
            </div>
          </div>

          {/* Right — Registration */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '35px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '20px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                Register for Event
              </h2>

              {/* Capacity */}
              {event.maxCapacity && (
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '25px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Registered</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{event.currentAttendees} / {event.maxCapacity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Available Spots</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>{event.maxCapacity - event.currentAttendees} remaining</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${capacityPercent}%`, height: '100%', backgroundColor: '#ff6b35' }} />
                  </div>
                </div>
              )}

              {success && (
                <div style={{
                  backgroundColor: '#f0fff0',
                  border: '1px solid #4caf50',
                  color: '#2e7d32',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {success}
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#fff0f0',
                  border: '1px solid #f44336',
                  color: '#f44336',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {!registered ? (
                <form onSubmit={handleRegister}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input name="fullName" type="text" value={formData.fullName}
                      onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Email Address *</label>
                    <input name="email" type="email" value={formData.email}
                      onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Phone Number</label>
                    <input name="phoneNumber" type="tel" value={formData.phoneNumber}
                      onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Department / Organization</label>
                    <input name="department" type="text" value={formData.department}
                      onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Special Requirements</label>
                    <textarea name="specialNeeds" value={formData.specialNeeds}
                      onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <button type="submit" disabled={registering} style={{
                    width: '100%',
                    backgroundColor: registering ? '#ccc' : '#ff6b35',
                    color: '#ffffff',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '18px',
                    cursor: registering ? 'not-allowed' : 'pointer',
                    marginTop: '10px'
                  }}>
                    {registering ? 'Registering...' : 'Confirm Registration'}
                  </button>
                  {!user && (
                    <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginTop: '15px' }}>
                      You need to be logged in to register.
                    </p>
                  )}
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
                  <p style={{ fontSize: '16px', color: '#2e7d32', fontWeight: '600' }}>
                    You are registered for this event!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EventDetailsPage