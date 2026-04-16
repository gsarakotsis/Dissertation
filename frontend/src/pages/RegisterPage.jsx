import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const ROLES = [
  {
    key: 'visitor',
    title: 'Visitor',
    desc: 'Browse and register for events. Perfect for students and guests who want to attend events.'
  },
  {
    key: 'cc_organizer',
    title: 'CC Event Organizer',
    desc: 'Create and manage events for your department or student organization within City College.'
  },
  {
    key: 'external_organizer',
    title: 'External Event Organizer',
    desc: 'Propose events as an external company or organization. Events require admin approval.'
  }
]

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ccType: '',
    department: '',
    companyName: '',
    companyUrl: '',
    position: '',
    phoneNumber: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.')
    }

    setLoading(true)
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        fullName: selectedRole !== 'visitor' ? formData.fullName : formData.email.split('@')[0],
        ...(selectedRole === 'cc_organizer' && {
          ccType: formData.ccType,
          department: formData.department
        }),
        ...(selectedRole === 'external_organizer' && {
          fullName: formData.fullName,
          companyName: formData.companyName,
          companyUrl: formData.companyUrl,
          position: formData.position,
          phoneNumber: formData.phoneNumber
        })
      }

      const user = await register(payload)

      if (user.role === 'admin' || user.role === 'cc_organizer') {
        navigate('/dashboard')
      } else if (user.role === 'external_organizer') {
        navigate('/external-dashboard')
      } else {
        navigate('/')
      }
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
        padding: '60px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* Step 1 — Role Selection */}
        {!selectedRole && (
          <div style={{ maxWidth: '900px', width: '100%' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '10px', color: '#1a1a1a' }}>
              Create Account
            </h1>
            <p style={{ fontSize: '18px', color: '#666', textAlign: 'center', marginBottom: '50px' }}>
              Choose how you want to use EventHub
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
              {ROLES.map(role => (
                <div key={role.key} onClick={() => setSelectedRole(role.key)} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '35px 30px',
                  cursor: 'pointer',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ff6b35'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,53,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#1a1a1a' }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                    {role.desc}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '15px', color: '#666' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#ff6b35', fontWeight: '700', textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </div>
        )}

        {/* Step 2 — Registration Form */}
        {selectedRole && (
          <div style={{ maxWidth: '560px', width: '100%' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '50px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <button onClick={() => setSelectedRole(null)} style={{
                background: 'none',
                border: 'none',
                color: '#ff6b35',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '0',
                marginBottom: '25px'
              }}>
                Back to role selection
              </button>

              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                {ROLES.find(r => r.key === selectedRole)?.title}
              </h1>
              <p style={{ fontSize: '15px', color: '#666', marginBottom: '30px' }}>
                Fill in your details to create your account
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

                {/* Visitor Form */}
                {selectedRole === 'visitor' && (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Email Address *</label>
                      <input name="email" type="email" value={formData.email}
                        onChange={handleChange} placeholder="your.email@example.com"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Password *</label>
                      <input name="password" type="password" value={formData.password}
                        onChange={handleChange} placeholder="Min. 6 characters"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                      <label style={labelStyle}>Confirm Password *</label>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword}
                        onChange={handleChange} placeholder="Repeat password"
                        required style={inputStyle} />
                    </div>
                  </>
                )}

                {/* CC Organizer Form */}
                {selectedRole === 'cc_organizer' && (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Full Name *</label>
                      <input name="fullName" type="text" value={formData.fullName}
                        onChange={handleChange} placeholder="Enter your full name"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Email Address *</label>
                      <input name="email" type="email" value={formData.email}
                        onChange={handleChange} placeholder="your.email@citycollege.edu"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Type *</label>
                      <select name="ccType" value={formData.ccType}
                        onChange={handleChange} required style={inputStyle}>
                        <option value="">Select type</option>
                        <option value="undergraduate">Undergraduate Student</option>
                        <option value="postgraduate">Postgraduate Student</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Department</label>
                      <input name="department" type="text" value={formData.department}
                        onChange={handleChange} placeholder="e.g. Computer Science"
                        style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Password *</label>
                      <input name="password" type="password" value={formData.password}
                        onChange={handleChange} placeholder="Min. 6 characters"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                      <label style={labelStyle}>Confirm Password *</label>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword}
                        onChange={handleChange} placeholder="Repeat password"
                        required style={inputStyle} />
                    </div>
                  </>
                )}

                {/* External Organizer Form */}
                {selectedRole === 'external_organizer' && (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Full Name *</label>
                      <input name="fullName" type="text" value={formData.fullName}
                        onChange={handleChange} placeholder="Enter your full name"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Email Address *</label>
                      <input name="email" type="email" value={formData.email}
                        onChange={handleChange} placeholder="your.email@company.com"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Company Name *</label>
                      <input name="companyName" type="text" value={formData.companyName}
                        onChange={handleChange} placeholder="Your company name"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Company Website *</label>
                      <input name="companyUrl" type="url" value={formData.companyUrl}
                        onChange={handleChange} placeholder="https://yourcompany.com"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Your Position *</label>
                      <input name="position" type="text" value={formData.position}
                        onChange={handleChange} placeholder="e.g. Marketing Manager"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Phone Number *</label>
                      <input name="phoneNumber" type="tel" value={formData.phoneNumber}
                        onChange={handleChange} placeholder="+30 123 456 7890"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Password *</label>
                      <input name="password" type="password" value={formData.password}
                        onChange={handleChange} placeholder="Min. 6 characters"
                        required style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                      <label style={labelStyle}>Confirm Password *</label>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword}
                        onChange={handleChange} placeholder="Repeat password"
                        required style={inputStyle} />
                    </div>
                  </>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%',
                  backgroundColor: loading ? '#ccc' : '#ff6b35',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '18px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
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
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default RegisterPage