const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatar : String,
  email: {
    type: String,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    trim: true
  },
  password: String,
  role : {
    type : String,
    require : true
  }
})

module.exports = mongoose.model("User", userSchema)