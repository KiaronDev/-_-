const { Signup, Login, verifyEmail, ForgotPassword, resetPassword, adminDashboard } = require("../Controllers/AuthController");
const {userVerification, checkAdminRole} = require("../Middlewares/AuthMiddleware")

const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login",Login)
router.post('/',userVerification)
router.post('/verify-email',verifyEmail)
router.post('/forgot-password',ForgotPassword)
router.patch('/reset-password/:token',resetPassword)
router.post('/admin-dashboard',checkAdminRole, adminDashboard)

module.exports = router;