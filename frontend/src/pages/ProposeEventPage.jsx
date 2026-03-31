import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

const ProposeEventPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    locationType: 'external',
    externalLocation: '',
    maxCapacity: '',
    externalLink: '',
    specialRequirements: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'external_organizer') navigate('/')
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
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

      navigate('/external-dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 18px', border: '2px solid #e0e0e0',
    borderRadius: '8px', fontSize: '15px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', backgroundColor: '#ffffff'
  }
  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: '700',
    color: '#1a1a1a', marginBottom: '10px'
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>

      <div style={{
        backgroundColor: '#1a1a1a', color: '#ffffff',
        padding: '15px 30px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '28px', fontWeight: '700' }}>
          <span style={{ color: '#ffffff' }}>Event</span>
          <span style={{ color: '#ff6b35' }}>Hub</span>
        </Link>
        <Link to="/external-dashboard" style={{ color: '#d0d0d0', textDecoration: 'none', fontSize: '15px' }}>
          Dashboard
        </Link>
      </div>

      <section style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '40px 30px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>Propose Event</h1>
          <p style={{ fontSize: '16px', color: '#d0d0d0' }}>Submit an event proposal for admin approval</p>
        </div>
      </section>

      <section style={{ maxWidth: '900px', margin: '-30px auto 60px', padding: '0 30px' }}>
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '12px',
          padding: '50px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>

          {error && (
            <div style={{
              backgroundColor: '#fff0f0', border: '1px solid #f44336',
              color: '#f44336', padding: '12px 16px', borderRadius: '8px',
              marginBottom: '25px', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

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
              <div>
                <label style={labelStyle}>Event Date <span style={{ color: '#ff6b35' }}>*</span></label>
                <input name="eventDate" type="date" value={formData.eventDate}
                  onChange={handleChange} required style={inputStyle} />
              </div>
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
                onChange={handleChange} placeholder="Describe your event in detail..."
                required style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Start Time <span style={{ color: '#ff6b35' }}>*</span></label>
                <input name="startTime" type="time" value={formData.startTime}
                  onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End Time <span style={{ color: '#ff6b35' }}>*</span></label>
                <input name="endTime" type="time" value={formData.endTime}
                  onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Location Address</label>
              <input name="externalLocation" type="text" value={formData.externalLocation}
                onChange={handleChange} placeholder="Enter full address or leave empty for on-campus"
                style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div>
                <label style={labelStyle}>Maximum Capacity</label>
                <input name="maxCapacity" type="number" value={formData.maxCapacity}
                  onChange={handleChange} placeholder="e.g. 100" min="1" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>External Event Link</label>
                <input name="externalLink" type="url" value={formData.externalLink}
                  onChange={handleChange} placeholder="https://example.com" style={inputStyle} />
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

            <div style={{
              backgroundColor: '#fff3e0', border: '1px solid #ff9800',
              padding: '15px 20px', borderRadius: '8px', marginBottom: '30px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Your proposal will be reviewed by an admin before becoming visible to the public.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button type="button" onClick={() => navigate('/external-dashboard')} style={{
                padding: '14px 35px', backgroundColor: 'transparent',
                border: '2px solid #1a1a1a', color: '#1a1a1a',
                borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer'
              }}>Cancel</button>
              <button type="submit" disabled={loading} style={{
                padding: '16px 45px',
                backgroundColor: loading ? '#ccc' : '#ff6b35',
                border: 'none', color: '#ffffff', borderRadius: '8px',
                fontWeight: '700', fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default ProposeEventPage;