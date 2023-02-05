
const User = require('../models/user.model')

module.exports.create = (req, res, next) => {
  const { name, phone, email, password, avatar, username,role = "user" } = req.body;
  console.log(req.body)
  new User(undefined,
    avatar,
    name,
    email,
    phone,
    username,
    password,
    role)
    .create()
    .then(user => {
      console.log('thanh cong!')
      res.status(200).json({message: 'Đăng kí thành công !', success : true, data : user})
    })
    .catch(err => res.status(501).json({message : err.message, success : err.isSuccess}))
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
    , undefined)
    .login()
    .then(user => {
      res.status(200).json({message: 'Đăng nhập thành công !', success : true, data : user})
    })
    .catch(err => res.status(500).json({message : err.message, success : err.isSuccess}))
}
