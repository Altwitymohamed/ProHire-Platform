const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;
    const user = await User.findById(req.user.id);
    
    // التأكد أن المستخدم صاحب عمل
    if (user.role !== 'employer') {
      return res.status(403).json({ msg: 'عذراً، المتقدمين لا يمكنهم نشر وظائف' });
    }

    // التأكد من توثيق الحساب
    if (!user.companyDetails.isVerified) {
      return res.status(403).json({ msg: 'حسابك غير موثق بعد، لا يمكنك نشر وظائف حالياً' });
    }

    const newJob = new Job({
      title, 
      description, 
      location, 
      salary,
      company: user.name,
      employer: user._id,
      employerEmail: user.email
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('خطأ في السيرفر');
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).send('خطأ في السيرفر');
  }
};
