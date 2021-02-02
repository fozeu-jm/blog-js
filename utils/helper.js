const fs = require("fs");
const path = require('path');
exports.deleteFile = (filepath) => {
    filepath = path.join(__dirname, "..", filepath);
    fs.unlink(filepath,(err) =>{
        if(err)
            throw (err);
    })
};