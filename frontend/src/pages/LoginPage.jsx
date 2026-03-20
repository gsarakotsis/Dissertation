import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin' || user.role === 'cc_organizer') {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
          maxWidth: '480px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '35px' }}>
            Sign in to your EventHub account
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '15px', color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#ff6b35', fontWeight: '700', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default LoginPage