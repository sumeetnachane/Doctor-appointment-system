const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

//Register Callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //password encrypted ho jayega
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res
      .status(201)
      .send({ message: "Registration Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

//Login Callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).send({ message: "User Not Found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password); //password ko decrypt kiya
    if (!isMatch) {
      res.status(200).send({
        message: "Invalid User or Password",
        success: false,
      });
    }
    //Token generate
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); //1 day tk user login rahega phir usko phir se log krna padega
    res.status(200).send({
      message: "Login Success",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error in Login Controller ${error.message}`,
    });
  }
};

//Auth controller callback
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth Error",
      success: false,
      error,
    });
  }
};
//Apply Doctor Controller
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Apply For Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Apply Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for doctor",
    });
  }
};

//notification Controller

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification; //notif. aayi
    seennotification.push(...notification); // notif. seennotif ko bheji
    user.notification = []; // notif ko empty kiys
    user.seennotification = notification; //seennotif. ko notif mila
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notification Marked as Read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Notification",
      success: false,
      error,
    });
  }
};

//Delete notification Controller
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to deleting notification",
      error,
    });
  }
};

//Get All Doctors
const getAllDoctorControllers = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "Approved" });
    res.status(200).send({
      success: true,
      message: "Doctors List Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

//BOOK APPOINTMENT
const bookAppintmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

//BOOKING AVAILABILITY CONTROLLER
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorControllers,
  bookAppintmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};
