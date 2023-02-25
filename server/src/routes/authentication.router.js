const authController = require('../controllers/authentication.controller')
const { verifyToken } = require('../middlewares')

module.exports = require('express').Router()
  .post("/login", authController.login)
  .post("/register", authController.create)
  .put('/logout', verifyToken ,authController.logOut)
  .get("/all", authController.getAll)
  .put("/change-password",verifyToken ,authController.changePasswordController)