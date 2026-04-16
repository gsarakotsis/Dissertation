const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

const register = async (req, res) => {
  try {
    const {
      fullName, email, password, role,
      department, organization, phoneNumber,
      ccType, companyName, companyUrl, position
    } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({
      fullName, email, password,
      role: role || 'visitor',
      department, organization, phoneNumber,
      ccType, companyName, companyUrl, position
    })

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      ccType: user.ccType,
      companyName: user.companyName,
      companyUrl: user.companyUrl,
      position: user.position,
      phoneNumber: user.phoneNumber,
      eventPlanner: user.eventPlanner,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive. Contact admin.' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    user.lastLogin = new Date()
    await user.save()

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      ccType: user.ccType,
      companyName: user.companyName,
      companyUrl: user.companyUrl,
      position: user.position,
      phoneNumber: user.phoneNumber,
      eventPlanner: user.eventPlanner,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMe = async (req, res) => {
  res.json(req.user)
}

module.exports = { register, login, getMe }