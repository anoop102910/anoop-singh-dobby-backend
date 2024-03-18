const sendResponse = (res, status, success,data, message) => {
    res.status(status).json({
        success: success,
        data,
        message: message 
    });
};
module.exports = sendResponse
