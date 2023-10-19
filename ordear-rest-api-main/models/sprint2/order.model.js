const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cartOrderFK: [{type: mongoose.Schema.Types.ObjectId, ref: "CartOrder" }],
    user: {  type: mongoose.Schema.Types.ObjectId, ref: "user" },
    restaurantFK : {type: mongoose.Schema.Types.ObjectId,ref: 'Restaurant'},
    taxFK : {type: mongoose.Schema.Types.ObjectId,ref: 'tax'},
    tableNb: {type: String},
    orderNb : {type: Number}, //
    statusOrder : {type: String},
    statusPay: {type: Boolean, default : false},
    statusRefunded: {type: Boolean, default : false},
    statusCancelRequest : {type: String},
    statusModified : {type: Boolean,default : 0},
    durationPreparation: {type: String, default : "0"},
    allergyName: {type: String},
    reason: {type : String, default : ""},
    suggestion : {type: String, default : ""},
    totalPrice: {type: String},
    payMethod: {type: String},
    date : {type : Date, default : Date.now},
    dateAcceptOrder : {type : Date, default : Date.now},
    confirmPay : {type: Boolean, default : false},
    reasonCancelOrder : {type :String, default : ""},
    noteCancelOrder : {type :String, default : ""},
    payment_intent :{type : String, default : ""},
    avisAdded : {type : Boolean, default :false},
    amountTips : {type : String, default :""},
    statusTips : {type : Boolean, default : false},
    statusMethodTips : {type : String, default :""},
    dateAvis : {type : Date,  default : null}

   
  },{versionKey: false, timestamps: true}
);

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
