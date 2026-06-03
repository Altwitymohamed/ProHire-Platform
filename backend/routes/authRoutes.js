const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User'); // هذا السطر كان ناقصاً وسيتسبب في خطأ (User is not defined)
const { register, login, getPendingEmployers, verifyEmployer, getMe } = require('../controllers/authController');

// مسار تحديث الملف الشخصي للمتقدم
router.post('/update-profile', auth, upload.single('cv'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // حفظ مسار السي في إذا تم رفعه
    if (req.file) {
      user.seekerDetails.cvPath = '/uploads/' + req.file.filename;
    }
    
    // حفظ المهارات إذا أرسلت
    if (req.body.skills) {
      user.seekerDetails.skills = req.body.skills;
    }
    
    await user.save();
    res.json({ msg: 'تم تحميل الملف بنجاح ✅', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('خطأ في السيرفر أثناء تحديث البيانات');
  }
});

// المسارات الأساسية
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

// روابط الآدمن
router.get('/pending-employers', auth, getPendingEmployers); // أضفنا auth لحماية بيانات الشركات
router.put('/verify-employer/:id', auth, verifyEmployer); // أضفنا auth لكي لا يوثق أي شخص الشركات

module.exports = router;
