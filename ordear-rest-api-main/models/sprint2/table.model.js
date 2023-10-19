const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNb : {type: Number},
    chairNb : {type: Number},
    qr : {type: String},
    restaurant : {type: mongoose.Schema.Types.ObjectId,ref: 'Restaurant'},
    user: {  type: mongoose.Schema.Types.ObjectId, ref: "user" },
 
});

const tableModel = mongoose.model("table",tableSchema)
module.exports = tableModel;