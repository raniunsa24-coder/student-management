const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 3) return res.status(400).json({ message: 'Name must be at least 3 characters' });
    if (!emailRe.test(email || '')) return res.status(400).json({ message: 'Enter a valid email address' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'This email is already registered' });
    }

    // The very first account becomes the admin; everyone after is a normal user.
    const isFirst = (await User.countDocuments()) === 0;
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: isFirst ? 'admin' : 'user',
    });
    res.status(201).json({ token: sign(user._id), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
