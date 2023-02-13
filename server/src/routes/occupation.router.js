const occupationController = require('../controllers/occupation.controller')

module.exports = require('express').Router()
  .get("/list", occupationController.getAll)
  .get("/detail", occupationController.getOne)
  .post("/create", occupationController.create)
  .put("/update", occupationController.updateOne)
  .delete("/delete", occupationController.delete)
