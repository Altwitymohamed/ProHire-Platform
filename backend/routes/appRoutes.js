const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { applyToJob, getMyStatus, getEmployerJobs, updateStatus } = require('../controllers/appController');

// يجب استخدام upload.single('cv') هنا لاستقبال الملف
router.post('/apply', auth, upload.single('cv'), applyToJob);

router.get('/my-status', auth, getMyStatus);
router.get('/employer-data', auth, getEmployerJobs);
router.put('/update-status', auth, updateStatus);

module.exports = router;
