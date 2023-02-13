const jobController = require('../controllers/job.controller')

module.exports = require('express').Router()
  .get("/list", jobController.readAll)
  .get("/list/sort-by-date", jobController.getAllSortByDate)
  .get("/detail", jobController.readOne)
  .post("/create", jobController.create)
  .delete("/delete", jobController.delete)
  .put("/update", jobController.updateOne)