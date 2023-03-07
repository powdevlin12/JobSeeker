const applicationController = require('../controllers/application.controller')
module.exports = require('express').Router()
    .get('/list', applicationController.getAll)
    .get('/detail', applicationController.getOne)
    .post('/create', applicationController.create)