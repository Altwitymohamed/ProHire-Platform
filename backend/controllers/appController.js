const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// دالة التقديم وتحديث البيانات (تم دمج منطق تحديث المهارات والسي في)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user.id);

    // 1. تحديث الملف الشخصي إذا أرسل المستخدم مهارات أو سي في جديد
    let isUpdated = false;
    if (req.file) {
      user.seekerDetails.cvPath = '/uploads/' + req.file.filename;
      isUpdated = true;
    }
    if (req.body.skills) {
      user.seekerDetails.skills = req.body.skills;
      isUpdated = true;
    }
    
    if (isUpdated) await user.save();

    // 2. إذا كان الطلب مجرد "تحديث بيانات" وليس تقديم على وظيفة
    if (!jobId) {
      return res.json({ msg: '✅ تم تحديث بياناتك المهنية بنجاح' });
    }

    // 3. التحقق من وجود السي في قبل التقديم على وظيفة
    if (!user.seekerDetails.cvPath) {
      return res.status(400).json({ msg: '⚠️ يرجى رفع السيرة الذاتية أولاً' });
    }

    // 4. منع التقديم المكرر على نفس الوظيفة
    const alreadyApplied = await Application.findOne({ jobId, 'applicant.id': user._id });
    if (alreadyApplied) {
      return res.status(400).json({ msg: 'لقد تقدمت لهذه الوظيفة مسبقاً' });
    }

    // 5. إنشاء طلب التوظيف بنسخة ثابتة من بيانات المتقدم الحالية
    const newApp = new Application({
      jobId,
      applicant: {
        id: user._id,
        name: user.name,
        email: user.email,
        cvPath: user.seekerDetails.cvPath,
        skills: user.seekerDetails.skills
      }
    });

    await newApp.save();
    res.json({ msg: '✅ تم تقديم طلبك بنجاح' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'خطأ في السيرفر' });
  }
};

// جلب طلبات المتقدم مع جلب إيميل صاحب العمل (مهم جداً للرد)
exports.getMyStatus = async (req, res) => {
  try {
    const apps = await Application.find({ 'applicant.id': req.user.id })
      .populate({
        path: 'jobId',
        select: 'title company employerEmail description location salary' // جلب البيانات كاملة
      });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: 'خطأ في جلب البيانات' });
  }
};

// جلب الوظائف والمتقدمين لصاحب العمل
exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    const results = await Promise.all(jobs.map(async (job) => {
      const applicants = await Application.find({ jobId: job._id });
      return { job, applicants };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'خطأ في السيرفر' });
  }
};

// تحديث حالة الطلب (قبول/رفض)
exports.updateStatus = async (req, res) => {
  try {
    const { appId, status } = req.body;
    await Application.findByIdAndUpdate(appId, { status });
    res.json({ msg: 'Success' });
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
};
