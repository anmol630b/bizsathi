const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'logo') uploadPath += 'logos/';
    else if (file.fieldname === 'coverImage') uploadPath += 'covers/';
    else if (file.fieldname === 'productImage') uploadPath += 'products/';
    else if (file.fieldname === 'avatar') uploadPath += 'avatars/';
    else uploadPath += 'misc/';
    createDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed (jpeg, jpg, png, webp, gif)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

exports.uploadLogo = upload.single('logo');
exports.uploadCover = upload.single('coverImage');
exports.uploadProduct = upload.array('productImage', 5);
exports.uploadAvatar = upload.single('avatar');

exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size cannot exceed 5MB'
      });
    }
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};
