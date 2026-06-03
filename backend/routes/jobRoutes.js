const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createJob, getJobs } = require('../controllers/jobController');

// أي شخص يمكنه رؤية الوظائف
router.get('/', getJobs);

// فقط الشركات الموثقة يمكنها النشر
router.post('/', auth, createJob);

module.exports = router;
