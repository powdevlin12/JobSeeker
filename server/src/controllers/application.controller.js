const applicationModel = require('../models/application.model')
module.exports.create = (req, res, next) => {
    console.log(req.body)
    const { idJobSeeker, idCompany, cv, submitDate } = req.body
    new applicationModel(
        undefined,
        idJobSeeker,
        idCompany,
        cv,
        submitDate
    )
        .create()
        .then((rel) => res.status(200).json({ message: 'application job success', success: true, data: rel }))
        .catch((err) => res.status(500).json({ message: 'failed', success: err.isSuccess }))

}
module.exports.getAll = (req, res, next) => {
    const { idCompany } = req.query
    new applicationModel()
        .getAll(idCompany)
        .then((rel) => res.status(200).json({ message: 'get all application success', success: true, data: rel }))
        .catch((err) => res.status(500).json({ message: 'failed', success: err.isSuccess }))
}
module.exports.getOne = (req, res, next) => {
    const { id } = req.body
    new applicationModel()
        .getOne(id)
        .then((rel) => res.status(200).json({ message: 'get one application success', success: true, data: rel }))
        .catch((err) => res.status(500).json({ message: 'failed', success: err.isSuccess }))
}