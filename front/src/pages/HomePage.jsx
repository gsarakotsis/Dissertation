import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          color: '#ffffff',
          padding: '100px 30px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '64px', fontWeight: '700', marginBottom: '25px', lineHeight: '1.2' }}>
              Event Management <span style={{ color: '#ff6b35' }}>System</span>
            </h1>
            <p style={{ fontSize: '22px', color: '#d0d0d0', marginBottom: '40px', lineHeight: '1.5' }}>
              Streamline event planning for departments and student organizations
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Link to="/register" style={{
                backgroundColor: '#ff6b35',
                color: '#ffffff',
                padding: '18px 45px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '18px',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(255,107,53,0.4)'
              }}>Get Started</Link>
              <Link to="/events" style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                padding: '16px 45px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '18px',
                textDecoration: 'none'
              }}>Browse Events</Link>
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section style={{ padding: '80px 30px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '60px' }}>
              Event Types We Support
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
              {[
                { title: 'Seminars & Speaking', desc: 'Academic presentations and educational sessions' },
                { title: 'Workshops', desc: 'Hands-on training with practical exercises' },
                { title: 'Parties & Social', desc: 'Social gatherings and networking events' },
                { title: 'Conferences', desc: 'Large-scale academic and professional events' },
                { title: 'Sports Events', desc: 'Athletic competitions and tournaments' },
                { title: 'Student Volunteering', desc: 'Community service opportunities' },
                { title: 'Internships', desc: 'Professional development opportunities' },
                { title: 'Clubs & Organizations', desc: 'Club meetings and organizational activities' },
                { title: 'PhD Awards & Others', desc: 'Academic ceremonies and other events' },
              ].map((type) => (
                <div key={type.title} style={{
                  backgroundColor: '#f5f5f5',
                  padding: '35px',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '15px' }}>{type.title}</h3>
                  <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: '#f5f5f5', padding: '80px 30px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
              Ready to organize your next event?
            </h2>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '35px', lineHeight: '1.6' }}>
              Join departments, student clubs, and partner organizations
            </p>
            <Link to="/register" style={{
              backgroundColor: '#ff6b35',
              color: '#ffffff',
              padding: '16px 40px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '18px',
              textDecoration: 'none'
            }}>Create Event</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage