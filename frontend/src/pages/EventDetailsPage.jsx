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

  const [feedback, setFeedback] = useState([])
  const [feedbackAverage, setFeedbackAverage] = useState(null)
  const [feedbackTotal, setFeedbackTotal] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)

  useEffect(() => {
    fetchEvent()
    fetchFeedback()
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

  const fetchFeedback = async () => {
    try {
      const { data } = await API.get(`/feedback/event/${id}`)
      setFeedback(data.feedback)
      setFeedbackAverage(data.average)
      setFeedbackTotal(data.total)
      if (user) {
        const mine = data.feedback.find(f => f.user._id === user._id)
        if (mine) setAlreadySubmitted(true)
      }
    } catch (err) {
      console.error(err)
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (userRating === 0) {
      setFeedbackError('Please select a rating.')
      return
    }
    setFeedbackError('')
    setFeedbackLoading(true)
    try {
      await API.post('/feedback', {
        eventId: id,
        rating: userRating,
        comment: userComment
      })
      setFeedbackSuccess('Thank you for your feedback!')
      setAlreadySubmitted(true)
      fetchFeedback()
    } catch (err) {
      setFeedbackError(err.response?.data?.message || 'Failed to submit feedback.')
    } finally {
      setFeedbackLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const isPastEvent = (date) => new Date(date) < new Date()

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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

          {/* Left — Event Details */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '50px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{
              fontSize: '42px', fontWeight: '700',
              color: '#1a1a1a', marginBottom: '20px', lineHeight: '1.2'
            }}>
              {event.title}
            </h1>

            {/* Meta */}
            <div style={{
              display: 'flex', gap: '30px', marginBottom: '30px',
              paddingBottom: '30px', borderBottom: '2px solid #f5f5f5', flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px' }}>
                  Date & Time
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {formatDate(event.eventDate)} • {event.startTime} - {event.endTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase', marginBottom: '5px' }}>
                  Department
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {event.department || 'N/A'}
                </div>
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
              {
                label: 'Location',
                value: event.externalLocation || (event.location
                  ? `${event.location.buildingName} - Room ${event.location.roomNumber}`
                  : 'TBA')
              },
              { label: 'Location Type', value: event.locationType === 'premises' ? 'On Campus' : 'External' },
              { label: 'Special Requirements', value: event.specialRequirements || 'None' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '15px 0', borderBottom: '1px solid #f0f0f0'
              }}>
                <span style={{ fontSize: '15px', color: '#888', fontWeight: '600' }}>{item.label}</span>
                <span style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '600' }}>{item.value}</span>
              </div>
            ))}

            {/* Organizer */}
            <div style={{
              marginTop: '40px', padding: '25px',
              backgroundColor: '#f5f5f5', borderRadius: '8px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Event Organizer</h2>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                {event.organizer?.fullName}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {event.organizer?.email}
              </div>
            </div>

            {/* Feedback Section */}
            <div style={{ marginTop: '50px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                Reviews & Feedback
              </h2>

              {/* Average Rating */}
              {feedbackTotal > 0 && (
                <div style={{
                  backgroundColor: '#f5f5f5', padding: '20px 25px',
                  borderRadius: '8px', marginBottom: '25px',
                  display: 'flex', alignItems: 'center', gap: '15px'
                }}>
                  <div style={{ fontSize: '48px', fontWeight: '700', color: '#ff6b35' }}>
                    {feedbackAverage}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{
                          fontSize: '22px',
                          color: star <= Math.round(feedbackAverage) ? '#ff6b35' : '#e0e0e0'
                        }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Based on {feedbackTotal} review{feedbackTotal !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Form */}
              {user && isPastEvent(event.eventDate) && registered && !alreadySubmitted && (
                <div style={{
                  backgroundColor: '#f5f5f5', padding: '25px',
                  borderRadius: '8px', marginBottom: '25px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                    Leave Your Review
                  </h3>

                  {feedbackError && (
                    <div style={{
                      backgroundColor: '#fff0f0', border: '1px solid #f44336',
                      color: '#f44336', padding: '12px 16px', borderRadius: '8px',
                      marginBottom: '15px', fontSize: '14px'
                    }}>
                      {feedbackError}
                    </div>
                  )}

                  {feedbackSuccess && (
                    <div style={{
                      backgroundColor: '#f0fff0', border: '1px solid #4caf50',
                      color: '#2e7d32', padding: '12px 16px', borderRadius: '8px',
                      marginBottom: '15px', fontSize: '14px'
                    }}>
                      {feedbackSuccess}
                    </div>
                  )}

                  <form onSubmit={handleFeedbackSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
                        Rating *
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} onClick={() => setUserRating(star)} style={{
                            fontSize: '36px', cursor: 'pointer',
                            color: star <= userRating ? '#ff6b35' : '#e0e0e0',
                            transition: 'color 0.2s'
                          }}>★</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
                        Comment
                      </label>
                      <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Share your experience..."
                        style={{
                          width: '100%', padding: '12px 15px',
                          border: '2px solid #e0e0e0', borderRadius: '8px',
                          fontSize: '15px', minHeight: '100px', resize: 'vertical',
                          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button type="submit" disabled={feedbackLoading} style={{
                      backgroundColor: feedbackLoading ? '#ccc' : '#ff6b35',
                      color: '#ffffff', border: 'none', padding: '12px 30px',
                      borderRadius: '8px', fontWeight: '700', fontSize: '15px',
                      cursor: feedbackLoading ? 'not-allowed' : 'pointer'
                    }}>
                      {feedbackLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {alreadySubmitted && (
                <div style={{
                  backgroundColor: '#f0fff0', border: '1px solid #4caf50',
                  color: '#2e7d32', padding: '15px 20px', borderRadius: '8px',
                  marginBottom: '25px', fontSize: '15px', fontWeight: '600'
                }}>
                  You have already submitted feedback for this event.
                </div>
              )}

              {/* Feedback List */}
              {feedback.length === 0 ? (
                <p style={{ color: '#666', fontSize: '15px' }}>No reviews yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {feedback.map(f => (
                    <div key={f._id} style={{
                      backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '10px'
                      }}>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>
                          {f.user.fullName}
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} style={{
                              fontSize: '16px',
                              color: star <= f.rating ? '#ff6b35' : '#e0e0e0'
                            }}>★</span>
                          ))}
                        </div>
                      </div>
                      {f.comment && (
                        <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                          {f.comment}
                        </p>
                      )}
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                        {new Date(f.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Registration */}
          <div>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '12px',
              padding: '35px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              position: 'sticky', top: '20px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                Register for Event
              </h2>

              {/* Capacity */}
              {event.maxCapacity && (
                <div style={{
                  backgroundColor: '#f5f5f5', padding: '20px',
                  borderRadius: '8px', marginBottom: '25px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Registered</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                      {event.currentAttendees} / {event.maxCapacity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Available Spots</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                      {event.maxCapacity - event.currentAttendees} remaining
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: '8px',
                    backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${capacityPercent}%`, height: '100%', backgroundColor: '#ff6b35'
                    }} />
                  </div>
                  {event.maxCapacity - event.currentAttendees === 0 && (
                    <div style={{
                      marginTop: '12px', color: '#f44336',
                      fontWeight: '700', fontSize: '14px', textAlign: 'center'
                    }}>
                      This event is full.
                    </div>
                  )}
                </div>
              )}

              {success && (
                <div style={{
                  backgroundColor: '#f0fff0', border: '1px solid #4caf50',
                  color: '#2e7d32', padding: '12px 16px', borderRadius: '8px',
                  marginBottom: '20px', fontSize: '14px'
                }}>
                  {success}
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#fff0f0', border: '1px solid #f44336',
                  color: '#f44336', padding: '12px 16px', borderRadius: '8px',
                  marginBottom: '20px', fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {isPastEvent(event.eventDate) ? (
                <div style={{
                  textAlign: 'center', padding: '20px',
                  color: '#888', fontSize: '15px', fontWeight: '600'
                }}>
                  This event has already taken place.
                </div>
              ) : !registered ? (
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
                      onChange={handleChange}
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <button type="submit" disabled={registering || (event.maxCapacity && event.currentAttendees >= event.maxCapacity)} style={{
                    width: '100%',
                    backgroundColor: registering || (event.maxCapacity && event.currentAttendees >= event.maxCapacity) ? '#ccc' : '#ff6b35',
                    color: '#ffffff', border: 'none', padding: '16px',
                    borderRadius: '8px', fontWeight: '700', fontSize: '18px',
                    cursor: registering || (event.maxCapacity && event.currentAttendees >= event.maxCapacity) ? 'not-allowed' : 'pointer',
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