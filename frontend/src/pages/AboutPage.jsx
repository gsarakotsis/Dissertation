import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const AboutPage = () => {
  return (
    <div>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        color: '#ffffff',
        padding: '100px 30px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '56px', fontWeight: '700', marginBottom: '25px', lineHeight: '1.2' }}>
            About <span style={{ color: '#ff6b35' }}>EventHub</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#d0d0d0', lineHeight: '1.7' }}>
            A centralized event management platform built for City College departments and student organizations.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 30px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '25px', color: '#1a1a1a' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '17px', color: '#666', lineHeight: '1.8', marginBottom: '20px' }}>
            EventHub was created to streamline the process of organizing, promoting, and managing events across City College. Whether it is an academic seminar, a student volunteering initiative, a sports tournament, or an external corporate workshop, EventHub provides a single platform where everything happens.
          </p>
          <p style={{ fontSize: '17px', color: '#666', lineHeight: '1.8' }}>
            Our goal is to eliminate the complexity of event coordination, reduce administrative overhead, and give students, faculty, and external organizations the tools they need to create meaningful experiences.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 30px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#1a1a1a' }}>
            What EventHub Offers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              {
                title: 'Event Management',
                desc: 'Create, edit, and manage events with full control over scheduling, location, capacity, and registration deadlines.'
              },
              {
                title: 'Role-Based Access',
                desc: 'Different roles for admins, CC organizers, external organizers, and visitors — each with the right level of access.'
              },
              {
                title: 'Event Approval',
                desc: 'External organizations can propose events which go through an admin approval process before becoming public.'
              },
              {
                title: 'Registration System',
                desc: 'Users can register for events, receive confirmation codes, and cancel their registration at any time before the event.'
              },
              {
                title: 'Email Notifications',
                desc: 'Automatic email confirmations for registrations, event approvals, rejections, and cancellations.'
              },
              {
                title: 'Location Management',
                desc: 'Admins can manage campus buildings and rooms, with capacity tracking and accessibility information.'
              },
            ].map(feature => (
              <div key={feature.title} style={{
                backgroundColor: '#ffffff',
                padding: '35px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#1a1a1a' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.7' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section style={{ padding: '80px 30px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#1a1a1a' }}>
            User Roles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
            {[
              {
                role: 'Admin',
                color: '#ff6b35',
                desc: 'Full system access. Manages users, approves or rejects event proposals, manages campus locations, and oversees all events.'
              },
              {
                role: 'CC Event Organizer',
                color: '#2196f3',
                desc: 'College department organizer. Can create and publish events directly without approval, and manage their own events.'
              },
              {
                role: 'External Event Organizer',
                color: '#9c27b0',
                desc: 'External organization or company. Can propose events which require admin approval before becoming visible to the public.'
              },
              {
                role: 'Visitor',
                color: '#4caf50',
                desc: 'Registered user. Can browse all published events, register for events, and manage their registrations from their profile.'
              },
            ].map(item => (
              <div key={item.role} style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                padding: '30px',
                borderLeft: `4px solid ${item.color}`
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: item.color }}>
                  {item.role}
                </h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.7', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section style={{ padding: '80px 30px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#1a1a1a' }}>
            Supported Event Types
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              'Merchandise', 'Speaking Events', 'Parties',
              'Conferences', 'Sports Events', 'Student Volunteering',
              'Internships', 'Clubs & Organizations', 'PhD Awards & Others'
            ].map(type => (
              <div key={type} style={{
                backgroundColor: '#ffffff',
                padding: '20px 25px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '80px 30px', backgroundColor: '#1a1a1a', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px', color: '#ffffff' }}>
            Contact Us
          </h2>
          <p style={{ fontSize: '17px', color: '#a0a0a0', lineHeight: '1.8', marginBottom: '10px' }}>
            City College — International Faculty of the University of Sheffield
          </p>
          <p style={{ fontSize: '17px', color: '#a0a0a0', lineHeight: '1.8', marginBottom: '10px' }}>
            Email: info@eventhub.edu
          </p>
          <p style={{ fontSize: '17px', color: '#a0a0a0', lineHeight: '1.8' }}>
            Phone: +30 123 456 7890
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage