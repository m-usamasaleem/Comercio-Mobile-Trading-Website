const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: {
      type: String,
      required: [true, "Details are required"],
      minLength: [10, "The details should have at least 10 characters"],
    },
    released_year: {
      type: String,
      required: [true, "released_year is required"],
    },

    condition: { type: String, required: [true, "condition is required"] },
    img_url: { type: String },
    phone_company: {
      type: String,
      required: [true, "phone_company is required"],
    },
    host: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String },
  },
  { timestamps: true }
);
delete mongoose.models.itemSchema;
delete mongoose.modelSchemas.itemSchema;
module.exports = mongoose.model("Item", itemSchema);
