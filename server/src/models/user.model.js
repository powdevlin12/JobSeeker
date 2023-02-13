const UserSchema = require('../schemas/user.schema')
var jwt = require('jsonwebtoken');
module.exports = class User {
  id
  #avatar
  #name
  #email
  #phone
  #username
  #password
  #role

  constructor(id, avatar, name, email, phone, username, password, role = "staff") {
    this.id = id
    this.#avatar = avatar
    this.#name = name
    this.#email = email
    this.#phone = phone
    this.#username = username
    this.#password = password
    this.#role = role
  }

  create = () => new Promise(async (resolve, reject) => {
    // check phone trung
    const phoneExist = await UserSchema.findOne({ phone: this.#phone })
    const emailExist = await UserSchema.findOne({ email: this.#email })
    if (phoneExist) {
      return reject({ message: "Số điện thoại này đã đăng ký trước đó !", isSuccess: false })
    }
    // check trung email
    if (emailExist) {
      return reject({ message: "Email này đã đăng ký trước đó !", isSuccess: false })
    }

    // thoa man het thi them vo
    const user = new UserSchema()
    user.name = this.#name
    user.avatar = this.#avatar
    user.phone = this.#phone
    user.email = this.#email
    user.username = this.#username
    user.password = this.#password
    user.role = this.#role
    user.save()
      .then(user => resolve(user))
      .catch(err => reject(err))
  })

  login = () => new Promise(async (resolve, reject) => {
    new Promise((resolve, reject) => {
      UserSchema
        .findOne({ username: this.#username })
        .then(user => { resolve(user) })
        .catch(err => reject(err))
    }).then(async user => {
      if (user) {
        if (user.password === this.#password) {
          jwt.sign({_id : user._id, role : user.role},process.env.SECRET_TOKEN_KEY,{
            expiresIn : process.env.EXPIRESIN
          }, function(err, token) {
            err ? console.log(err) : console.log(token)
          })
          resolve(user)
        } else {
          reject({ message: "Tài khoản hoặc mật khẩu không chính xác", isSuccess: false })
        }
      } else {
        reject({ message: "Tài khoản không tồn tại", isSuccess: false })
      }
    })
      .catch(err => reject(err))
  })
}