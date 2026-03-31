import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'visitor',
    department: '',
    phoneNumber: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
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
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1a1a1a'
  }

  return (
    <div>
      <Header />
      <section style={{
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 30px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '50px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '35px' }}>
            Join EventHub and start exploring events
          </p>

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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Full Name *</label>
              <input name="fullName" type="text" value={formData.fullName}
                onChange={handleChange} placeholder="Enter your full name"
                required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email Address *</label>
              <input name="email" type="email" value={formData.email}
                onChange={handleChange} placeholder="your.email@example.com"
                required style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Password *</label>
                <input name="password" type="password" value={formData.password}
                  onChange={handleChange} placeholder="Min. 6 characters"
                  required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password *</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Repeat password"
                  required style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Role *</label>
              <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                <option value="visitor">Visitor</option>
                <option value="cc_organizer">CC Event Organizer</option>
                <option value="external_organizer">External Event Organizer</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Department / Organization</label>
              <input name="department" type="text" value={formData.department}
                onChange={handleChange} placeholder="Your department or organization"
                style={inputStyle} />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Phone Number</label>
              <input name="phoneNumber" type="tel" value={formData.phoneNumber}
                onChange={handleChange} placeholder="+30 123 456 7890"
                style={inputStyle} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#ccc' : '#ff6b35',
                color: '#ffffff',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '18px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '15px', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#ff6b35', fontWeight: '700', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default RegisterPage