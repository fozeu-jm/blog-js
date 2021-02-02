const multer = require("multer");
const path = require("path");

exports.fileStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Math.floor(new Date().getTime() / 1000) + '-' + file.originalname);
    },
    destination: (req, file, cb) => {
        cb(null, './uploads');
    }
});

exports.fileFilter = (req, file, cb) => {
    let authorizedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
    if(authorizedExtensions.includes(path.extname(file.originalname).toLowerCase())){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

exports.defaultElmtPerPage="2";