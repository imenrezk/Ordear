const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, unique : true},
    price: { type: Number },
    visibility: { type: Boolean, default: true },
    ingredientFK: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
  },
  {
    timestamps: true,
  }
);

const itemModel = mongoose.model("Items", itemSchema);
module.exports = itemModel;
