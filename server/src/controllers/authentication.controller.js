
const User = require('../models/user.model');
const userSchema = require('../schemas/user.schema');

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
      console.log('thanh cong!')
      res.status(200).json({ message: 'Đăng kí thành công !', success: true, data: user })
    })
    .catch(err => res.status(501).json({ message: err.message, success: err.isSuccess }))
}

module.exports.login = (req, res, next) => {
  const { username, password } = req.body;
  new User(undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , username
    , password
    , undefined
    , undefined
    , undefined)
    .login()
    .then(user => {
      res.status(200).json({ message: 'Đăng nhập thành công !', success: true, data: user })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}

module.exports.logOut = (req, res, next) => {
  const { _id } = req.body
  new User(_id
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    , undefined
    ,undefined)
    .logOut()
    .then(data => {
      console.log(data)
      return res.status(201).json({ message: "logout success", isSuccess: true })
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({message : "logout success", isSuccess : false, err})
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
  const {password, newPassword} = req.body;
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
  const {input} = req.body;
  new User(
    undefined,
    undefined,
    undefined,
    input,
    input,
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
  const {newPassword, confirmPasswordCode, email} = req.body
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