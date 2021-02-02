const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const configMiddleware = require("./middlewares/config");
const mongoose = require('mongoose');
const secretConfigs = require("./secrets/config");
const path = require("path");
const error = require("./middlewares/error");
const utils = require("./utils/config");
const multer = require("multer");

const MONGODB_URI = secretConfigs.MONGODB_URI;



app.use(multer({storage: utils.fileStorage, fileFilter: utils.fileFilter}).single("image"));

app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use(configMiddleware.corsConfig);

app.use("/api", feedRoutes);
app.use(error.errorHandler);

mongoose.connect(MONGODB_URI).then((result) => {
    app.listen(8000);
}).catch(err => {
    console.log(err);
});