const mongoose = require('mongoose')

const ERole = {
  superAdmin: 'superAdmin',
  resRestaurant : 'responsable',
  client: 'client',
  preparator: 'preparator',
  server: 'server',
  accueil: 'accueil',
  employee :'employee'
};
const userSchema = new mongoose.Schema({
    firstName : {type: String},
    lastName : {type: String},
    userName: {type: String},
    image : {type: String},
    address : {type: String},
    phone : {type: String},
    email : {type: String},
    password:{type:String},   
    birthday: {type:String},
    help: {type: Boolean},
    activate:{type:Boolean},
    role: {type: String,  enum: Object.values(ERole)},
    firstLogin:{type: Boolean},
    provider : {type: String},
    proof:{type:String},
    statusarchieve:{type : Boolean},
    restaurantFK : {type: mongoose.Schema.Types.ObjectId,ref: 'Restaurant'},
   },{ versionKey: false, timestamps: true }
  );
const userModel = mongoose.model("user",userSchema)
module.exports = userModel;