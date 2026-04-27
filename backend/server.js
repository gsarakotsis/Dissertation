const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ quiet: true });

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/feedback', require('./routes/feedback'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'EventHub API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const createDefaultAdmin = async () => {
  try {
    const User = require('./models/User')
    const existing = await User.findOne({ email: 'admin@citycollege.edu' })
    if (!existing) {
      await User.create({
        fullName: 'Admin User',
        email: 'admin@citycollege.edu',
        password: 'admin123',
        role: 'admin',
        status: 'active'
      })
      console.log('Default admin created: admin@citycollege.edu / admin123')
    }
  } catch (error) {
    console.error('Admin creation error:', error.message)
  }
}

const createDefaultLocations = async () => {
  try {
    const Location = require('./models/Location')
    const locations = [
      { buildingName: 'City College Ltd', roomName: 'Proxenou Koromila 24' },
      { buildingName: 'City College Leontos Sofou', roomName: 'Leontos Sofou 3' },
      { buildingName: 'City College Galini Campus', roomName: 'Galini Campus' }
    ]

    for (const loc of locations) {
      const existing = await Location.findOne({ buildingName: loc.buildingName })
      if (!existing) {
        await Location.create(loc)
        console.log(`Location created: ${loc.buildingName}`)
      }
    }
  } catch (error) {
    console.error('Location creation error:', error.message)
  }
}

const deleteOldEvents = async () => {
  try {
    const Event = require('./models/Event')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const result = await Event.deleteMany({
      eventDate: { $lt: yesterday }
    })

    if (result.deletedCount > 0) {
      console.log(`🗑️ Deleted ${result.deletedCount} old events`)
    }
  } catch (error) {
    console.error('Delete old events error:', error.message)
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
  await createDefaultAdmin();
  await createDefaultLocations();
  await deleteOldEvents();
  setInterval(deleteOldEvents, 24 * 60 * 60 * 1000);
});