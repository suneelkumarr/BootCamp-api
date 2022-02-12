const express = require('express')

const { registerUser,
    loginUser,
    getMe,
    logout,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword} = require('../controller/auth');

const router = express.Router();
const { protect } = require("../middleware/auth");

router.post('/register',registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, getMe);
router.route("/logout").get(protect, logout);
router.route("/updatedetails").put(protect, updateDetails);
router.route("/updatepassword").put(protect, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").put(resetPassword);


module.exports = router;