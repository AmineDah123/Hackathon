const express = require('express');
const catchAsync = require('../middlewares/asyncHandler');
const { getStatus } = require('../controllers/statusController');

const router = express.Router();

router.get('/', catchAsync(getStatus));

module.exports = router;
