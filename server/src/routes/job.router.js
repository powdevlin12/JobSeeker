const jobController = require('../controllers/job.controller')
const { verifyToken, verifyTokenIsAdmin } = require('../middlewares')
const { uploadImage } = require('../services/uploadImage.service')

module.exports = require('express').Router()
  //lấy ra tất cả job hiện có
  .get("/list", jobController.readAll)
  //
  .get("/list/sort-by-date", jobController.getAllSortByDate)
  //thông tin chi tiết của job
  .get("/detail", jobController.readOne)
  //tạo job mới
  .post("/create", jobController.create)
  //xóa job
  .delete("/delete", jobController.delete)
  //update job
  .put("/update", jobController.updateOne)
  // lọc job theo idOccupation, idCompany, Sắp xếp, ...
  .get("/list/filter", jobController.getFilterJob)
  //Lấy danh sách tất cả công việc đã đăng của 1 công ty
  .get("/list/all-moderator-job", jobController.getAllJobModerator)
  .get("/list/search", jobController.getSearchJob)

  .post("/upload/image", uploadImage.single('fileUpload'), jobController.uploadImage)