import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import API from '../services/api'

const EVENT_TYPES = [
  { value: '', label: 'All' },
  { value: 'merchandise', label: 'Merchandise' },
  { value: 'speaking_event', label: 'Speaking Events' },
  { value: 'party', label: 'Parties' },
  { value: 'conference', label: 'Conferences' },
  { value: 'sports', label: 'Sports' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'internship', label: 'Internships' },
  { value: 'club', label: 'Clubs' },
  { value: 'phd_award', label: 'PhD Awards' },
  { value: 'other', label: 'Others' },
]

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [activeType])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeType) params.type = activeType
      const { data } = await API.get('/events', { params })
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const typeLabel = (type) => {
    const found = EVENT_TYPES.find(t => t.value === type)
    return found ? found.label : type
  }

  return (
    <div>
      <Header />

      {/* Page Header */}
      <section style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '60px 30px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '15px' }}>
            Upcoming Events
          </h1>
          <p style={{ fontSize: '18px', color: '#d0d0d0' }}>
            Discover events from departments and student organizations
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '25px 30px' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title or description..."
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
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {EVENT_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setActiveType(type.value)}
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeType === type.value ? '#ff6b35' : '#f5f5f5',
                  color: activeType === type.value ? '#ffffff' : '#1a1a1a',
                  transition: 'all 0.3s'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section style={{ padding: '50px 30px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
              Loading events...
            </p>
          ) : filteredEvents.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
              No events found.
            </p>
          ) : (
            <>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '30px'
              }}>
                {filteredEvents.map(event => (
                  <div key={event._id} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s'
                  }}>
                    {/* Event Image */}
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: event.photo
                        ? `url(http://localhost:5000${event.photo}) center/cover`
                        : 'linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#ffffff',
                        color: '#1a1a1a',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700'
                      }}>
                        {typeLabel(event.eventType)}
                      </span>
                    </div>

                    {/* Event Content */}
                    <div style={{ padding: '25px' }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: '10px'
                      }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                        {formatDate(event.eventDate)} • {event.startTime}
                      </p>
                      <p style={{
                        fontSize: '15px',
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '14px', color: '#888' }}>
                          {event.currentAttendees} attending
                          {event.maxCapacity ? ` / ${event.maxCapacity}` : ''}
                        </span>
                        <Link to={`/events/${event._id}`} style={{
                          backgroundColor: '#ff6b35',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '15px',
                          textDecoration: 'none'
                        }}>
                          View Details
                        </Link>
                      </div>
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

export default EventsPage