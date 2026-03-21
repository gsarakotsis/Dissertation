import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import API from '../services/api'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('registrations')

  useEffect(() => {
    if (!user) navigate('/login')
    fetchRegistrations()
  }, [user])

  const fetchRegistrations = async () => {
    try {
      const { data } = await API.get('/registrations/my-registrations')
      setRegistrations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (registrationId) => {
    if (!window.confirm('Cancel your registration for this event?')) return
    try {
      await API.delete(`/registrations/${registrationId}`)
      fetchRegistrations()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const isPast = (date) => new Date(date) < new Date()

  return (
    <div>
      <Header />
      <section style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '60px 30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#ff6b35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            flexShrink: 0
          }}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>{user?.fullName}</h1>
            <p style={{ fontSize: '16px', color: '#d0d0d0' }}>{user?.email} • {user?.role}</p>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 30px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '35px', borderBottom: '2px solid #f0f0f0' }}>
          {[
            { key: 'registrations', label: 'My Registrations' },
            { key: 'profile', label: 'Profile Info' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '12px 25px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: activeTab === tab.key ? '#ff6b35' : '#666',
              borderBottom: activeTab === tab.key ? '2px solid #ff6b35' : '2px solid transparent',
              marginBottom: '-2px'
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div>
            {loading ? (
              <p style={{ color: '#666' }}>Loading...</p>
            ) : registrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                  You have not registered for any events yet.
                </p>
                <a href="/events" style={{
                  backgroundColor: '#ff6b35',
                  color: '#ffffff',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '15px',
                  textDecoration: 'none'
                }}>Browse Events</a>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {registrations.map(reg => (
                  <div key={reg._id} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: reg.status === 'cancelled' ? 0.6 : 1
                  }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                        {reg.event?.title || 'Event'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        {reg.event?.eventDate ? formatDate(reg.event.eventDate) : ''} • {reg.event?.startTime}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        Confirmation Code: <strong style={{ color: '#ff6b35' }}>{reg.confirmationCode}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        backgroundColor: reg.status === 'registered' ? '#e8f5e9' : '#f5f5f5',
                        color: reg.status === 'registered' ? '#2e7d32' : '#666'
                      }}>
                        {reg.status}
                      </span>
                      {reg.status === 'registered' && !isPast(reg.event?.eventDate) && (
                        <button onClick={() => handleCancel(reg._id)} style={{
                          padding: '8px 18px',
                          border: '2px solid #f44336',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#f44336',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}>Cancel</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Info Tab */}
        {activeTab === 'profile' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '35px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: '600px'
          }}>
            {[
              { label: 'Full Name', value: user?.fullName },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: user?.role },
              { label: 'Department', value: user?.department || 'Not specified' },
              { label: 'Phone', value: user?.phoneNumber || 'Not specified' },
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage