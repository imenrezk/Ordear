const mongoose = require ('mongoose');

const productSchema = new mongoose.Schema({
    name : {type: String, required:true, unique:true},
    photo : {type:String, required:true, unique:true},
    description : {type:String},
    price : {type: Number,default:0},
    disponibility : {type: String, default:'Yes'},
    disponibilityDuration : {type: Number, required:false},
    promotion : {type: Number,required:false, default:0},
    visibility : {type: String, default:'ENABLE'},
    categoryFK : {type: mongoose.Schema.Types.ObjectId, ref:"Category"}
},{
    timestamps:true
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
