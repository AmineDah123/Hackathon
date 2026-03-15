const multer = require('multer');
const fs = require('fs');

const errorHandler = (err, req, res, next) => {
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, () => {});
  }
  if (err instanceof multer.MulterError || err.message === 'Only JPG and PDF files are allowed.') {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
};

module.exports = errorHandler;
