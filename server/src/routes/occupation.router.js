const occupationController = require('../controllers/occupation.controller')
const { verifyTokenIsAdmin, verifyToken } = require('../middlewares')

module.exports = require('express').Router()
  .get("/list", verifyToken, occupationController.getAll)
  .get("/detail", occupationController.getOne)
  .post("/create", occupationController.create)
  .put("/update", occupationController.updateOne)
  .delete("/delete", occupationController.delete)
