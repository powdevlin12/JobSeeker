const authController = require('../controllers/authentication.controller')

module.exports = require('express').Router()
  .post("/login", authController.login)
  .post("/register", authController.create)
  .get("/all", authController.getAll)