const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
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
app.use("/api/auth", authRoutes);
app.use(error.errorHandler);

mongoose.connect(MONGODB_URI).then((result) => {
    const server = app.listen(8000);
    const io = require("./socket").init(server);

    //socket is connection between server and client
    io.on('connection', (socket) => {
        console.log('Connected to client: ' + socket.id);
    });
}).catch(err => {
    console.log(err);
});