const mongoose = require("mongoose");
const schema = mongoose.Schema;
require("dotenv").config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log(`Database connected`);
});

const cseSchema = new schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  company: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const cseModel = mongoose.model("cseModel", cseSchema);
module.exports = cseModel;
