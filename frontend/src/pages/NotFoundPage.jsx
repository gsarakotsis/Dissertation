import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const NotFoundPage = () => {
  return (
    <div>
      <Header />
      <section style={{
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 30px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            fontSize: '120px',
            fontWeight: '700',
            lineHeight: '1',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#1a1a1a' }}>4</span>
            <span style={{ color: '#ff6b35' }}>0</span>
            <span style={{ color: '#1a1a1a' }}>4</span>
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '20px'
          }}>
            Page Not Found
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.7',
            marginBottom: '40px'
          }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/" style={{
              backgroundColor: '#ff6b35',
              color: '#ffffff',
              padding: '14px 35px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              textDecoration: 'none'
            }}>
              Go Home
            </Link>
            <Link to="/events" style={{
              backgroundColor: 'transparent',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              padding: '12px 35px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              textDecoration: 'none'
            }}>
              Browse Events
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default NotFoundPage;