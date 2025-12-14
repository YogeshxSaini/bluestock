import multer from 'multer';
import path from 'path';
import config from '../config/index.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer
export const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter,
});

// Single file upload middleware
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload middleware
export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

export default {
  upload,
  uploadSingle,
  uploadMultiple,
};
