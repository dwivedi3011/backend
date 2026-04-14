import asyncHandler from "../utils/asynchandler.js";

// this is basically the controller
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "Siddhant here"
    });
});

export { registerUser };