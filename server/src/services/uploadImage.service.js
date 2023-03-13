const multer = require('multer');
const path = require('path')
//config khi luu anh. nếu muốn lưu ảnh ở directory khác thì tạo một config khác.
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/image/job_image")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

module.exports.uploadImage = multer({ storage: imageStorage });

