
const Company = require('../models/company.model');
const companySchema = require('../schemas/company.schema');

module.exports.create = (req, res, next) => {
  const { name, totalEmployee, type, about, phone, location, idUser } = req.body;
  console.log(req.body)
  new Company(
    undefined, name, totalEmployee, type, about, phone, false, location, idUser
  )
    .create()
    .then(user => {
      console.log('thanh cong!')
      res.status(200).json({ message: 'add new company success', success: true, data: user })
    })
    .catch(err => res.status(501).json({ message: err.message, success: err.isSuccess }))
}

module.exports.getOne = (req, res, next) => {
  const { id } = req.query;
  new Company()
    .readOne(id)
    .then(rel =>
      res.status(200).json({ message: 'get company success', success: true, data: rel })
    )
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
/**
 * @openapi
 * /company/list:
 *   get:
 *     summary: Returns all company.
 *     responses: 
 *       '200':
 *         description: OK
 */
module.exports.getAll = (req, res, next) => {
  var page = req.query.page
  new Company()
    .readAll(page)
    .then(rel => {
      res.status(200).json({ message: 'get all  company  success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}

module.exports.getPaging = (req, res, next) => {
  try {
    new Company(
      undefined, undefined, undefined, undefined, undefined, undefined, undefined
    )
      .getPaging(Number.parseInt(req.query.page))
      .then(rel => {
        res.status(200).json({ message: 'get all  company  success', success: true, data: rel })
      })
      .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
  }
  catch (e) {
    res.status(500).json({ message: 'get all  failed', success: false })
  }
}

module.exports.updateOne = (req, res, next) => {
  const { _id, name, totalEmployee, type, about, phone, location, idUser } = req.body;
  const company = new companySchema()
  company._id = _id
  company.name = name
  company.totalEmployee = totalEmployee
  company.type = type
  company.about = about
  company.phone = phone
  company.location = location
  company.idUser = idUser
  new Company()
    .update(company)
    .then((rel) => { res.status(200).json({ message: 'update company success', success: true, relsult: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}

module.exports.delete = (req, res, next) => {
  const { id } = req.body
  new Company(id)
    .delete(id)
    .then((rel) => { res.status(200).json({ message: 'delete company success', success: true, relsult: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}









