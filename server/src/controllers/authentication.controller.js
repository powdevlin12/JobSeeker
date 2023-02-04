
const User = require('../models/user.model')

module.exports.create = (req, res, next) => {
  const { name, phone, email, password, role = "user" } = req.body;

  new User(undefined,
    undefined,
    name,
    email,
    phone,
    password,
    role)
    .create()
    .then(user => {
      req.session.user = user
      res.status(200).json({message: 'Đăng kí thành công !', success : true, data : user})
    })
    .catch(err => res.status(500).json({message : err.toString(), success : false}))
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  new User(undefined
    , undefined
    , undefined
    , email
    , undefined
    , password
    , undefined)
    .login()
    .then(user => {
      req.session.user = user
      res.status(200).json({message: 'Đăng nhập thành công !', success : true, data : user})
    })
    .catch(err => res.status(500).json({message : err.toString(), success : false}))
}
