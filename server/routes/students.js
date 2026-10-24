const router = require('express').Router();
const Student = require('../models/Student');
const { protect, adminOnly } = require('../middleware/auth');

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(b) {
  if (!b.name || b.name.trim().length < 3) return 'Name must be at least 3 characters';
  if (!b.rollNo || !b.rollNo.trim()) return 'Roll number is required';
  if (!emailRe.test(b.email || '')) return 'Enter a valid email address';
  if (!/^\d{10,15}$/.test((b.phone || '').replace(/[\s-]/g, ''))) return 'Phone must be 10 to 15 digits';
  if (!b.course || !b.course.trim()) return 'Course is required';
  if (b.age !== '' && b.age != null && (Number(b.age) < 15 || Number(b.age) > 60)) return 'Age must be between 15 and 60';
  return null;
}

const pick = (b) => ({
  name: b.name,
  rollNo: b.rollNo,
  email: b.email,
  phone: b.phone,
  course: b.course,
  gender: b.gender || 'Male',
  age: b.age === '' || b.age == null ? undefined : Number(b.age),
  address: b.address || '',
});

router.use(protect);

// Dashboard numbers
router.get('/stats', async (req, res, next) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [total, thisWeek, courses, recent] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ createdAt: { $gte: weekAgo } }),
      Student.distinct('course'),
      Student.find().sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ total, thisWeek, courses: courses.length, recent });
  } catch (e) {
    next(e);
  }
});

// List with search + pagination
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 8, 50);
    const search = (req.query.search || '').trim();

    const filter = {};
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: rx }, { rollNo: rx }, { email: rx }, { course: rx }];
    }

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ students, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const s = await Student.findById(req.params.id).populate('createdBy', 'name');
    if (!s) return res.status(404).json({ message: 'Student not found' });
    res.json(s);
  } catch (e) {
    if (e.name === 'CastError') return res.status(404).json({ message: 'Student not found' });
    next(e);
  }
});

// Any logged-in user can add
router.post('/', async (req, res, next) => {
  try {
    const err = validate(req.body);
    if (err) return res.status(400).json({ message: err });
    const s = await Student.create({ ...pick(req.body), createdBy: req.user._id });
    res.status(201).json(s);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'A student with this roll number already exists' });
    next(e);
  }
});

// Admin only: edit + delete
router.put('/:id', adminOnly, async (req, res, next) => {
  try {
    const err = validate(req.body);
    if (err) return res.status(400).json({ message: err });
    const s = await Student.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Student not found' });
    res.json(s);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'A student with this roll number already exists' });
    next(e);
  }
});

router.delete('/:id', adminOnly, async (req, res, next) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
