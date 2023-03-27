const UserSchema = require('../schemas/user.schema')
var jwt = require('jsonwebtoken');
const { genaralAccessToken, genaralRefreshToken } = require('../utils');
const { SendMailText } = require('../services/sendmail.service');
module.exports = class User {
  #id
  #avatar
  #name
  #email
  #phone
  #username
  #password
  #role
  #refreshToken
  #confirmPasswordCode
  constructor(id, avatar, name, email, phone, username, password, role = "staff", refreshToken = null, confirmPasswordCode=null) {
    this.#id = id
    this.#avatar = avatar
    this.#name = name
    this.#email = email
    this.#phone = phone
    this.#username = username
    this.#password = password
    this.#role = role
    this.#refreshToken = refreshToken
    this.#confirmPasswordCode = confirmPasswordCode
  }

  create = () => new Promise(async (resolve, reject) => {
    // check phone trung
    const phoneExist = await UserSchema.findOne({ phone: this.#phone })
    const emailExist = await UserSchema.findOne({ email: this.#email })
    const usernameExist = await UserSchema.findOne({username : this.#username})

    if (phoneExist) {
      return reject({ message: "Số điện thoại này đã đăng ký trước đó, vui lòng đổi lại !", isSuccess: false })
    }
    // check trung email
    if (emailExist) {
      return reject({ message: "Email này đã đăng ký trước đó, vui lòng đổi lại !", isSuccess: false })
    }

    if (usernameExist) {
      return reject({ message: "Username này đã đăng ký trước đó, vui lòng đổi lại !", isSuccess: false })
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
    user.refreshToken = this.#refreshToken
    user.confirmPasswordCode = this.#confirmPasswordCode
    user.save()
      .then(user => resolve(user))
      .catch(err => reject(err))
  })

  login = () => new Promise(async (resolve, reject) => {
    new Promise((resolve, reject) => {
      UserSchema
        .findOne({ username: this.#username })
        .then(user => resolve(user))
        .catch(err => reject(err))
    }).then(async user => {
      if (user) {
        if (user.password === this.#password) {

          const newRefreshToken = jwt.sign({ _id : user._id, role : user.role }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: process.env.REFRESH_EXPIRESIN
          })

          let newAccessToken = jwt.sign({_id : user._id, role : user.role}, process.env.SECRET_TOKEN_KEY, {
            expiresIn : process.env.ACCESS_EXPIRESIN
          })
          
          resolve({accessToken : newAccessToken, refreshToken : newRefreshToken})
          await UserSchema.updateOne({_id : user._id}, {refreshToken : newAccessToken})
        } else {
          reject({ message: "Tài khoản hoặc mật khẩu không chính xác", isSuccess: false })
        }
      } else {
        reject({ message: "Tài khoản không tồn tại", isSuccess: false })
      }
    })
      .catch(err => reject(err))
  })

  createRefreshToken = () => new Promise(async (resolve, reject) => {
    try {
      const user = await UserSchema.findById({_id : this.#id})
      console.log(user)

      let newRefreshToken, newAccessToken       
      const {_id, role} = user

      newRefreshToken = jwt.sign({_id, role}, process.env.REFRESH_TOKEN_KEY, {
        expiresIn : process.env.REFRESH_EXPIRESIN
      })

      newAccessToken = jwt.sign({_id, role}, process.env.SECRET_TOKEN_KEY, {
        expiresIn : process.env.ACCESS_EXPIRESIN
      })

      await UserSchema.updateOne({_id}, {refreshToken : newRefreshToken})
      resolve({accessToken : newAccessToken, refreshToken : newRefreshToken, isSuccess : true})
    } catch (error) {
      console.log(error)
      return reject({message : "Error in server !", isSuccess : false})
    }
  })

  getAll = () => {
    return new Promise(async (resolve, reject) => {
      UserSchema.find({})
        .then((user) => resolve(user))
        .catch((err) => { reject(err) })
    })
  }
  
  update = (user) => {
    return new Promise((resolve, reject) => {
      UserSchema.findByIdAndUpdate(user._id, user)
        .then(rel => resolve(user))
        .catch(err => reject(err))
    })
  }
  updatePassword = (user) => {
    return new Promise((resolve, reject) => {
      UserSchema.findByIdAndUpdate(user._id, { password: user.password })
        .then(rel => resolve(user))
        .catch(err => reject(err))
    })
  }
  delete = (id) => {
    return new Promise((resolve, reject) => {

    })
  }


  changePassword = (newPassword) => new Promise(async (resolve, reject) => {
    try {
      const user = await UserSchema.findOne({_id : this.#id})
      if (user) { 
        this.#password !== user.password ? reject({message : "Mật khẩu không đúng !", isSuccess: false})
        : UserSchema.updateOne({_id : this.#id}, {
          password : newPassword
        }).then(res => resolve({message : "Đổi mật khẩu thành công !", isSuccess : true, res}))
          .catch(err => {
            return reject({message : "Lỗi server", err : err})
          })
      } else {
        reject({message : "Không có người này, token bị sai !", isSuccess: false})
      }
    } catch (error) {
      console.log(error)
      return reject({message : "Lỗi server", err : err})
    }
  })

  forgotPassword = () => new Promise(async (resolve, reject) => {
    try {
      const user = await UserSchema.findOne({$or : [
        {email : this.#email},
        {phone : this.#phone}
      ]})
      
      if (user) {
        const confirmPasswordCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; 
      
        await UserSchema.updateOne({email : this.#email}, {confirmPasswordCode : confirmPasswordCode})
        .then( async () => {
          await SendMailText(this.#email, "Mã xác nhận gmail", `Mã xác nhận là : ${confirmPasswordCode}`)
          .then(() => {
              return resolve({message : "Chúng tôi đã gửi mã về cho bạn, vui lòng kiểm tra !", isSuccess : true})
          })
        })
        .catch(err => reject({message : "Có lỗi từ server !", isSuccess : false, err : err}))
      } else {
        return reject({message : "Không tìm thấy tài khoản này, vui lòng thử lại !", isSuccess : false})
      }
    } catch (error) {
      return reject({error : error, message : "Có lỗi từ server", isSuccess : false})
    }
  })

  confirmPassword = (newPassword) => new Promise(async (resolve, reject) => {
    console.log(this.#email, newPassword, this.#confirmPasswordCode)

    try {
      const user = await UserSchema.findOne({confirmPasswordCode : this.#confirmPasswordCode, email : this.#email})
      if (user) {
        const userUpdate = await UserSchema.updateOne({email : this.#email}, {password : newPassword})
        if (userUpdate) {
          return resolve({message : "Đặt lại mật khẩu thành công !", isSuccess : true})
        }
      }  else {
        return reject({message : "Mã xác nhận không đúng, thử lại !", isSuccess : false})
      }    
    } catch (error) {
      console.log(error)
      return reject({message : "Lỗi từ server ! vui lòng thử lại !", error : error, isSuccess : false})
    }
  })

  logOut = () => new Promise(async (resolve, reject) => {
    try {
      const data = await UserSchema.updateOne({_id : this.#id},{refreshToken : null})
      resolve({data, message : "Logout success", isSuccess : true})
    } catch (error) {
      console.log(error)
      reject({error, message : "Error", isSuccess : false})
    }
  })

  getUser = () => new Promise(async(resolve, reject) => {
    try {
      const res = await UserSchema.findOne({_id : this.#id})
      console.log(res)
      resolve(res)
    } catch (error) {
      console.log(err)
      reject(err)
    }
  })
}