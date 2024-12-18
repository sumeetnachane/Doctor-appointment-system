const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    //Schema created
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "first name required"],
    },
    lastName: {
      type: String,
      required: [true, "last name required"],
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    email: {
      type: String,
      required: [true, "eamil is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerCunsaltation: {
      type: Number,
      required: [true, "feesPerCunsaltation is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "work timie is required"],
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
