const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  nameRes: { type: String},  
  address: { type: String},
  cuisineType: {type: String},
  taxeTPS: { type: String},
  taxeTVQ: { type: String},
  color: { type: String},
  logo: {type: String},
  images: {type:String},
  promotion: {type: String},
  payCashMethod: {type : String},

  owner : {type: mongoose.Schema.Types.ObjectId,ref: 'user', unique: true}, //unique: true : pour
  table : {type: mongoose.Schema.Types.ObjectId,ref: 'Table'},
  menu: {type: mongoose.Schema.Types.ObjectId,ref: 'Menu' },
//  categories: [{type: mongoose.Schema.Types.ObjectId,ref: 'Category',}],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
