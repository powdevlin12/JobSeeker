const { getUserIdFromJWTToken } = require('../middlewares');
const User = require('../models/user.model');
const userSchema = require('../schemas/user.schema');
var jwt = require('jsonwebtoken');
const path = require('path')


module.exports.create = (req, res, next) => {
  const { name, phone, email, password, avatar, username, role = "user", refreshToken = null } = req.body;
  console.log(req.body)
  new User(undefined,
    avatar,
    name,
    email,
    phone,
    username,
    password,
    role,
    refreshToken,
    undefined
  )
    .create()
    .then(user => {
      res.status(200).json({ message: 'Chúc mừng, bạn đã đăng kí thành công tài khoản của JobSeeker !', success: true, data: user })
    })
    .catch(err => res.status(401).json({ message: err.message, success: err.isSuccess }))
}

module.exports.login = (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  new User(undefined
    , undefined
    , undefined
    , username
    , undefined
    , username
    , password
    , undefined
    , undefined
    , undefined)
    .login()
    .then(result => {
      res.status(200).json({ message: 'Đăng nhập thành công !', success: true, data: result })
    })
    .catch(err => res.status(401).json({ message: err.message, success: err.isSuccess }))
}

module.exports.logOut = (req, res, next) => {
  const { _id } = req.data
  new User(_id
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined)
    .logOut()
    .then(data => {
      console.log(data)
      return res.status(201).json({ message: "logout success", isSuccess: true })
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({ message: "logout success", isSuccess: false, err })
    }
    )
}

module.exports.getAll = (req, res, next) => {
  new User(undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined).getAll()
    .then((user) => { res.status(200).json({ user: user }) })
    .catch((err) => { res.status(500).json({ message: err }) })
}
module.exports.updateOne = (req, res, next) => {
  const { _id, name, avatar, email, phone, username, password, role } = req.body;
  const user = new userSchema()
  user._id = _id
  user.name = name
  user.avatar = avatar
  user.email = email
  user.phone = phone
  user.username = username
  user.password = password
  user.role = role
  new User()
    .update(user)
    .then((rel) => { res.status(200).json({ message: 'update job success', success: true, job: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}
module.exports.changePasswordController = (req, res, next) => {
  const { password, newPassword } = req.body;
  console.log(req.data)
  new User(
    req.data._id,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    password,
    undefined,
    undefined,
    undefined
  )
    .changePassword(newPassword)
    .then(response => res.status(201).json(response))
    .catch(err => {
      console.log(err)
      return res.status(500).json(err)
    })
}

module.exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  new User(
    undefined,
    undefined,
    undefined,
    email,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ).forgotPassword()
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json(err))
}

module.exports.confirmPassword = (req, res, next) => {
  const { newPassword, confirmPasswordCode, email } = req.body
  new User(
    undefined,
    undefined,
    undefined,
    email,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    confirmPasswordCode
  ).confirmPassword(newPassword)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json(err))
}

module.exports.createRefreshToken = (req, res, next) => {
  const { _id, role } = req.data
  new User(
    _id,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    role,
    undefined,
    undefined
  ).createRefreshToken()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
}

module.exports.logout = (req, res, next) => {
  const { _id } = req.data
  new User(
    _id,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ).logOut()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
}

module.exports.getUser = (req, res, next) => {
  const { _id } = req.data
  new User(
    _id,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ).getUser()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
}

module.exports.editProfile = (req, res, next) => {
  const { _id } = req.data
  const { name, email, phone } = req.body
  const file = req.file
  new User(
    _id,
    file?.filename,
    name,
    email,
    phone,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ).putUser()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
}

