const companyController = require('../controllers/company.controller')

module.exports = require('express').Router()
  .get("/list", companyController.getAll)
  .get("/detail", companyController.getOne)
  .post("/create", companyController.create)
  .put("/update", companyController.updateOne)
  .delete("/delete", companyController.delete)