
exports.getPrivateData = (req, res, next) => {
    console.log("req :", req.user);
    res.status(200).json({
        success: true,
        data: {
            message: "Login success! You have permission to see our website.",
            user: req.user
        }
    });
};