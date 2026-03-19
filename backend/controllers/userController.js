const User = require('../models/User');
const crypto = require('crypto');

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};
    if (search) query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users  (Admin creates user manually)
const createUser = async (req, res) => {
  try {
    const { fullName, email, role, department, organization, phoneNumber, eventPlanner, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const tempPassword = crypto.randomBytes(8).toString('hex');

    const user = await User.create({
      fullName, email,
      password: tempPassword,
      role, department, organization,
      phoneNumber, eventPlanner: eventPlanner || false,
      status: status || 'active'
    });

    // TODO: sendWelcomeEmail(user, tempPassword)

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      tempPassword // show once to admin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    // Only admin can change role/eventPlanner, user can update own info
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user._id.toString() === req.params.id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['fullName', 'phoneNumber', 'department', 'organization'];
    if (isAdmin) allowedFields.push('role', 'eventPlanner', 'status');

    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };