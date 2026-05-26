const mongoose = require("mongoose");
const RideHistory = require("./models/RideHistory");

mongoose.connect("mongodb://localhost:27017/yourDB");

async function seedHistory() {
  try {
    await RideHistory.deleteMany(); // optional: clear old fake data

    const fakeHistory = [
      {
        userId: "684abc1234567890abcd0001",
        routeId: "684abc1234567890abcd1001",
        groupId: "684abc1234567890abcd2001",
        rideDate: new Date("2026-05-18"),
        groupSize: 4,
      },
      {
        userId: "684abc1234567890abcd0001",
        routeId: "684abc1234567890abcd1002",
        groupId: "684abc1234567890abcd2002",
        rideDate: new Date("2026-05-19"),
        groupSize: 3,
      },
      {
        userId: "684abc1234567890abcd0001",
        routeId: "684abc1234567890abcd1003",
        groupId: "684abc1234567890abcd2003",
        rideDate: new Date("2026-05-21"),
        groupSize: 5,
      },
      {
        userId: "684abc1234567890abcd0001",
        routeId: "684abc1234567890abcd1004",
        groupId: "684abc1234567890abcd2004",
        rideDate: new Date("2026-05-24"),
        groupSize: 2,
      },
    ];

    await RideHistory.insertMany(fakeHistory);

    console.log("Fake ride history inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedHistory();  