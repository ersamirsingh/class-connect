import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
}).single('photo');

export const uploadMultipleImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
}).array('images', 3);

export const uploadGenericFile = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for video/files
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    const isPdf = file.mimetype === 'application/pdf';

    if (isImage || isVideo || isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only images, videos, and PDF documents are allowed.'));
    }
  },
}).single('file');
