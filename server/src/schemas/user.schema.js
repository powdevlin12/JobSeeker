const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require : true
  },
  avatar :{
    type: String
  },
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
  password: {
    type: String,
    require: true
  },
  role : {
    type : String,
    require : true
  },
  refreshToken : {
    type: String
  },
  confirmPasswordCode : {
    type : Number
  }
})

module.exports = mongoose.model("User", userSchema)