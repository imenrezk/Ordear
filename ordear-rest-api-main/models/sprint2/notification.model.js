const mongoose = require("mongoose");
const moment = require('moment');

const notificationSchema = new mongoose.Schema(
  {
    orderFK: [{type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    userConcerned : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    restaurantFK : {type: mongoose.Schema.Types.ObjectId, ref: "Restaurant"},
    title : {type: String},
    body: {type: String},
    suggestion: {type: String},
    date : {type : Date, default : moment()},
   
  },{versionKey: false, timestamps: true}
);

const notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;

