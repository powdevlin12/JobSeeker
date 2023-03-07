const authController = require('../controllers/authentication.controller')

const { SendMail, SendMailText } = require('../services/sendmail.service')

const { verifyToken } = require('../middlewares')


module.exports = require('express').Router()
  .post("/login", authController.login)
  .post("/register", authController.create)

  .get("/all", authController.getAll)
  .get("/mail", (req, res) => {
    SendMailText("factyel.bttn@gmail.com", "test mail from job", "xin chao")
      .then((rel) => res.send(rel))
      .catch(err => res.send(err))

  })

  .put('/logout', verifyToken ,authController.logOut)
  .get("/all", authController.getAll)
  .put("/change-password",verifyToken ,authController.changePasswordController)

