const multer = require('multer');
const path = require('path')
//config khi luu anh. nếu muốn lưu ảnh ở directory khác thì tạo một config khác.
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../upload/image")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../upload/cv")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

module.exports.upload = {
    Image: multer({ storage: imageStorage }),
    CV: multer({ storage: cvStorage })
};


