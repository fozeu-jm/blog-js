
exports.errorHandler = (error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    const fields = error.fields;
    res.status(status).json({message: message, validate: fields});
};