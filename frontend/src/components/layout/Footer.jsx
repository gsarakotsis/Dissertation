import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '50px 30px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '50px'
      }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '15px' }}>
            <span style={{ color: '#ffffff' }}>Event</span>
            <span style={{ color: '#ff6b35' }}>Hub</span>
          </div>
          <p style={{ color: '#a0a0a0', lineHeight: '1.6', fontSize: '15px' }}>
            Streamlining event management for departments and student organizations
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '15px' }}>Home</Link>
            <Link to="/events" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '15px' }}>Events</Link>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Contact</h4>
          <p style={{ color: '#a0a0a0', lineHeight: '1.8', fontSize: '15px' }}>
            Email: info@eventhub.edu<br />
            Phone: +30 123 456 7890
          </p>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px',
        margin: '30px auto 0',
        paddingTop: '30px',
        borderTop: '1px solid #333',
        textAlign: 'center',
        color: '#a0a0a0',
        fontSize: '14px'
      }}>
        <p>&copy; 2026 EventHub. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer