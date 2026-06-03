const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, description, website, address } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'المستخدم موجود مسبقاً' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name, email, password: hashedPassword, role,
      companyDetails: role === 'employer' ? { description, website, address, isVerified: false } : undefined
    });
    await user.save();
    res.json({ msg: 'تم التسجيل بنجاح' });
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'بيانات غير صحيحة' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'بيانات غير صحيحة' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { res.status(500).send('Server Error'); }
};

// الدالة الأهم لإصلاح مشكلة اختفاء البيانات عند التحديث
exports.getMe = async (req, res) => {
  try {
    // جلب المستخدم مع كافة تفاصيل السيرة الذاتية والمهارات
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getPendingEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer', 'companyDetails.isVerified': false });
    res.json(employers);
  } catch (err) { res.status(500).send('Error'); }
};

exports.verifyEmployer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.companyDetails.isVerified = true;
    await user.save();
    res.json({ msg: 'Verified' });
  } catch (err) { res.status(500).send('Error'); }
};
