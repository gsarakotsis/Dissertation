import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import API from '../services/api'

const ArchivePage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    fetchArchivedEvents()
  }, [])

  const fetchArchivedEvents = async () => {
    try {
      const { data } = await API.get('/events?status=archived')
      setEvents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const years = [...new Set(events.map(e =>
    new Date(e.eventDate).getFullYear()
  ))].sort((a, b) => b - a)

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    const matchesYear = selectedYear
      ? new Date(event.eventDate).getFullYear() === parseInt(selectedYear)
      : true
    return matchesSearch && matchesYear
  })

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div>
      <Header />

      <section style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '60px 30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '15px' }}>
            Event Archive
          </h1>
          <p style={{ fontSize: '18px', color: '#d0d0d0' }}>
            Browse past events from departments and student organizations
          </p>
        </div>
      </section>

      <section style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '25px 30px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search archived events..."
              style={{
                flex: 1,
                padding: '15px 20px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                padding: '15px 20px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#ffffff',
                minWidth: '140px',
                cursor: 'pointer'
              }}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section style={{ padding: '50px 30px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Loading...</p>
          ) : filteredEvents.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>No archived events found.</p>
          ) : (
            <>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                {filteredEvents.length} archived event{filteredEvents.length !== 1 ? 's' : ''}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                {filteredEvents.map(event => (
                  <div key={event._id} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    opacity: 0.85
                  }}>
                    <div style={{
                      width: '100%',
                      height: '180px',
                      background: event.photo
                        ? `url(http://localhost:5000${event.photo}) center/cover`
                        : 'linear-gradient(135deg, #888 0%, #555 100%)',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700'
                      }}>
                        Archived
                      </span>
                    </div>
                    <div style={{ padding: '25px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                        {formatDate(event.eventDate)}
                      </p>
                      <p style={{
                        fontSize: '14px', color: '#888', lineHeight: '1.6', marginBottom: '15px',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                      <Link to={`/events/${event._id}`} style={{
                        color: '#ff6b35',
                        fontWeight: '700',
                        fontSize: '14px',
                        textDecoration: 'none'
                      }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ArchivePage