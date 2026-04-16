import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

const EventFormPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    department: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    locationType: 'premises',
    location: '',
    externalLocation: '',
    maxCapacity: '',
    registrationDeadline: '',
    externalLink: '',
    specialRequirements: ''
  })

  const isExternal = user?.role === 'external_organizer'
  const isAdmin = user?.role === 'admin' || user?.role === 'cc_organizer'

  useEffect(() => {
    if (!user || user.role === 'visitor') navigate('/')
    if (!isExternal) fetchLocations()
  }, [user])

  const fetchLocations = async () => {
    try {
      const { data } = await API.get('/locations')
      setLocations(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const validateDate = () => {
    if (!formData.eventDate) return true
    const selected = new Date(formData.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selected >= today
  }

  const handleSubmit = async (e, type) => {
    e.preventDefault()
    setError('')

    if (!validateDate()) {
      setError('Event date cannot be in the past.')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') data.append(key, value)
      })
      if (photoFile) data.append('photo', photoFile)

      await API.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (isExternal) {
        navigate('/external-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit event.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (isExternal) navigate('/external-dashboard')
    else navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '10px'
  }

  const sectionTitle = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f5f5f5',
    marginTop: '40px'
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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to={isExternal ? '/external-dashboard' : '/dashboard'} style={{
            color: '#d0d0d0', textDecoration: 'none', fontSize: '15px'
          }}>
            Dashboard
          </Link>
          <span style={{ color: '#666' }}>|</span>
          <span style={{ color: '#d0d0d0', fontSize: '15px' }}>{user?.fullName}</span>
        </div>
      </div>

      {/* Page Header */}
      <section style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '40px 30px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
            {isExternal ? 'Propose Event' : 'Add New Event'}
          </h1>
          <p style={{ fontSize: '16px', color: '#d0d0d0' }}>
            {isExternal
              ? 'Submit an event proposal for admin approval'
              : 'Create a new event for your department or organization'}
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ maxWidth: '900px', margin: '-30px auto 60px', padding: '0 30px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '50px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>

          {error && (
            <div style={{
              backgroundColor: '#fff0f0',
              border: '1px solid #f44336',
              color: '#f44336',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '25px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {isExternal && (
            <div style={{
              backgroundColor: '#fff3e0',
              border: '1px solid #ff9800',
              padding: '15px 20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Your proposal will be reviewed by an admin before becoming visible to the public.
              </p>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>

            {/* Basic Information */}
            <h2 style={{ ...sectionTitle, marginTop: '0' }}>Basic Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Event Type <span style={{ color: '#ff6b35' }}>*</span></label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} required style={inputStyle}>
                  <option value="">Select event type</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="speaking_event">Speaking Event</option>
                  <option value="party">Party</option>
                  <option value="conference">Conference</option>
                  <option value="sports">Sports Event</option>
                  <option value="volunteering">Student Volunteering</option>
                  <option value="internship">Internship</option>
                  <option value="club">Clubs & Organizations</option>
                  <option value="phd_award">PhD Award</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {!isExternal && (
                <div>
                  <label style={labelStyle}>Department</label>
                  <input name="department" type="text" value={formData.department}
                    onChange={handleChange} placeholder="e.g. Computer Science"
                    style={inputStyle} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Event Title <span style={{ color: '#ff6b35' }}>*</span></label>
              <input name="title" type="text" value={formData.title}
                onChange={handleChange} placeholder="Enter event title"
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Description <span style={{ color: '#ff6b35' }}>*</span></label>
              <textarea name="description" value={formData.description}
                onChange={handleChange} placeholder="Provide a detailed description..."
                required style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} />
              <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                Include information about speakers, agenda, and target audience
              </div>
            </div>

            {/* Date & Time */}
            <h2 style={sectionTitle}>Date & Time</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Event Date <span style={{ color: '#ff6b35' }}>*</span></label>
                <input name="eventDate" type="date" value={formData.eventDate}
                  onChange={handleChange} required style={inputStyle}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label style={labelStyle}>Start Time <span style={{ color: '#ff6b35' }}>*</span></label>
                <input name="startTime" type="time" value={formData.startTime}
                  onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>End Time <span style={{ color: '#ff6b35' }}>*</span></label>
                <input name="endTime" type="time" value={formData.endTime}
                  onChange={handleChange} required style={inputStyle} />
              </div>
              {!isExternal && (
                <div>
                  <label style={labelStyle}>Registration Deadline</label>
                  <input name="registrationDeadline" type="date" value={formData.registrationDeadline}
                    onChange={handleChange} style={inputStyle}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
              )}
            </div>

            {/* Location */}
            <h2 style={sectionTitle}>Location</h2>

            {!isExternal ? (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <label style={labelStyle}>Location Type <span style={{ color: '#ff6b35' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '30px' }}>
                    {[
                      { value: 'premises', label: 'On Campus / Premises' },
                      { value: 'external', label: 'External Location' }
                    ].map(opt => (
                      <label key={opt.value} style={{
                        display: 'flex', alignItems: 'center',
                        gap: '10px', cursor: 'pointer', fontSize: '15px'
                      }}>
                        <input type="radio" name="locationType" value={opt.value}
                          checked={formData.locationType === opt.value}
                          onChange={handleChange}
                          style={{ width: '20px', height: '20px', accentColor: '#ff6b35' }} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {formData.locationType === 'premises' ? (
                  <div style={{ marginBottom: '25px' }}>
                    <label style={labelStyle}>Room / Hall</label>
                    <select name="location" value={formData.location}
                      onChange={handleChange} style={inputStyle}>
                      <option value="">Select location</option>
                      {locations.map(loc => (
                        <option key={loc._id} value={loc._id}>
                          {loc.buildingName} - Room {loc.roomNumber} (Capacity: {loc.capacity})
                        </option>
                      ))}
                    </select>
                    {locations.length === 0 && (
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                        No locations available. Ask an admin to add locations first.
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: '25px' }}>
                    <label style={labelStyle}>External Location Address</label>
                    <input name="externalLocation" type="text" value={formData.externalLocation}
                      onChange={handleChange} placeholder="Enter full address"
                      style={inputStyle} />
                  </div>
                )}
              </>
            ) : (
              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>Location Address</label>
                <input name="externalLocation" type="text" value={formData.externalLocation}
                  onChange={handleChange} placeholder="Enter full address or leave empty for on-campus"
                  style={inputStyle} />
              </div>
            )}

            {/* Additional Details */}
            <h2 style={sectionTitle}>Additional Details</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Maximum Capacity</label>
                <input name="maxCapacity" type="number" value={formData.maxCapacity}
                  onChange={handleChange} placeholder="e.g. 100" min="1"
                  style={inputStyle} />
                <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>Leave empty for unlimited</div>
              </div>
              <div>
                <label style={labelStyle}>External Event Link</label>
                <input name="externalLink" type="url" value={formData.externalLink}
                  onChange={handleChange} placeholder="https://example.com"
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Event Photo</label>
              {photoPreview && (
                <img src={photoPreview} alt="Preview" style={{
                  width: '100%', maxHeight: '200px', objectFit: 'cover',
                  borderRadius: '8px', border: '2px solid #e0e0e0', marginBottom: '15px'
                }} />
              )}
              <label htmlFor="photo-upload" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px', border: '2px dashed #e0e0e0', borderRadius: '8px',
                cursor: 'pointer', backgroundColor: '#fafafa'
              }}>
                <div style={{ textAlign: 'center', fontSize: '15px', color: '#666' }}>
                  <span style={{ color: '#ff6b35', fontWeight: '700' }}>Click to upload</span> or drag and drop
                  <br /><span style={{ fontSize: '13px' }}>PNG, JPG or JPEG (max 5MB)</span>
                </div>
              </label>
              <input id="photo-upload" type="file" accept="image/*"
                onChange={handlePhoto} style={{ display: 'none' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Special Requirements / Notes</label>
              <textarea name="specialRequirements" value={formData.specialRequirements}
                onChange={handleChange} placeholder="Any prerequisites, materials needed, etc."
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
            </div>

            {/* Actions — 3 buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '15px',
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '2px solid #f5f5f5'
            }}>
              {/* Cancel — always visible */}
              <button type="button" onClick={handleCancel} style={{
                padding: '14px 35px',
                backgroundColor: 'transparent',
                border: '2px solid #1a1a1a',
                color: '#1a1a1a',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                Cancel
              </button>

              {/* Add Event — μόνο για admin & cc_organizer */}
              {isAdmin && (
                <button type="button" onClick={(e) => handleSubmit(e, 'add')}
                  disabled={loading} style={{
                    padding: '16px 45px',
                    backgroundColor: loading ? '#ccc' : '#ff6b35',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
                  }}>
                  {loading ? 'Creating...' : 'Add Event'}
                </button>
              )}

              {/* Propose Event — μόνο για external_organizer */}
              {isExternal && (
                <button type="button" onClick={(e) => handleSubmit(e, 'propose')}
                  disabled={loading} style={{
                    padding: '16px 45px',
                    backgroundColor: loading ? '#ccc' : '#ff6b35',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
                  }}>
                  {loading ? 'Submitting...' : 'Propose Event'}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default EventFormPage