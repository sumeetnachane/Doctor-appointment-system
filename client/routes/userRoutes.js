const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorControllers,
  bookingAvailabilityController,
  bookAppintmentController,
  userAppointmentsController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

//router object create
const router = express.Router();

//Routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//AUTH || POST
router.post("/getUserData", authMiddleware, authController);

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Notification Doctor || POST read
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//Notification Doctor || POST delete
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//GET ALL DOCTOR
router.get("/getAllDoctors", authMiddleware, getAllDoctorControllers);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppintmentController);

//Booking Avliability
router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);
module.exports = router;
