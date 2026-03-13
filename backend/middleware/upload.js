const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Multer config
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new ErrorResponse('Error: File upload only supports the following filetypes: ' + filetypes, 400, 'INVALID_FILE_TYPE'));
  },
});

module.exports = upload;
