const express = require('express');
const catchAsync = require('../middlewares/asyncHandler');
const upload = require('../middlewares/upload');
const { strictLimiter } = require('../config/rateLimit');
const {
  getGroups,
  createGroup,
  getGroupById,
  deleteGroup,
  addMember,
  removeMember
} = require('../controllers/groupController');

const router = express.Router();

router.get('/', catchAsync(getGroups));
router.post('/', strictLimiter, catchAsync(createGroup));
router.get('/:id', catchAsync(getGroupById));
router.delete('/:id', catchAsync(deleteGroup));
router.post('/:id/members', strictLimiter, upload.single('photo'), catchAsync(addMember));
router.delete('/:id/members/:memberId', catchAsync(removeMember));

module.exports = router;
