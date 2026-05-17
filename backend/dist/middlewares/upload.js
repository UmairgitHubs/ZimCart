import multer from 'multer';
import path from 'path';
// Configure storage to use memory (better for Cloudinary flow)
const storage = multer.memoryStorage();
// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed!'));
    }
};
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
//# sourceMappingURL=upload.js.map