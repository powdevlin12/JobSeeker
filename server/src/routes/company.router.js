const companyController = require('../controllers/company.controller')
const { verifyToken, verifyTokenIsAdmin } = require('../middlewares')

module.exports = require('express').Router()
  .get("/list",companyController.getAll)
  .get("/detail", companyController.getOne)
  .post("/create", companyController.create)
  .put("/update", companyController.updateOne)
  .delete("/delete", companyController.delete)