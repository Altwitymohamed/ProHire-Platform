const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seeker', 'employer'], required: true },
  
  // بيانات الشركة والتوثيق
  companyDetails: {
    description: String,
    website: String,
    address: String,
    isVerified: { type: Boolean, default: false },
    verificationDoc: { type: String, default: '' } // رابط وثيقة السجل التجاري
  },

  // بيانات الباحث عن عمل
  seekerDetails: {
    skills: { type: String, default: '' },
    cvPath: { type: String, default: '' }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
