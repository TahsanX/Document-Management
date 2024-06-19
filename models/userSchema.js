const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO).then(() => {
  console.log(`Database connected`);
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dept: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("User", UserSchema);
