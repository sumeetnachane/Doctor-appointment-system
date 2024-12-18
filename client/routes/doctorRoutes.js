const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");
const { route } = require("./userRoutes");

const router = express.Router();

//POST SINGLE DOCTOR INFO
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//GET SINGLE DOCTOR INFO
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

//GET Appointments    //2
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController); //1

module.exports = router;
