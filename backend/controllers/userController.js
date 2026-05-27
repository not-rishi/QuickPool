const User = require("../models/User");
const RideHistory = require("../models/RideHistory");

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-__v");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await RideHistory.find({ userId: req.userId }).populate(
      "routeId groupId",
    );
    res.json(history);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { usn, name, email, phone, department, gender } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { usn }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      usn,
      name,
      email,
      phone,
      department,
      gender,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
