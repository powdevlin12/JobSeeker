
const Job = require('../models/job.model');
const jobSchema = require('../schemas/job.schema');

module.exports.create = (req, res, next) => {
  const { name, description, requirement, hourWorking, postingDate, deadline, salary, locationWorking, idOccupation, idcompany } = req.body;
  new Job(undefined,
    name,
    description,
    requirement,
    hourWorking,
    postingDate,
    deadline,
    salary,
    locationWorking,
    idOccupation,
    idcompany)
    .create()
    .then(user => {
      res.status(200).json({ message: 'create job success', success: true, data: user })
    })
    .catch(err => res.status(501).json({ message: err.message, success: err.isSuccess }))
}

module.exports.readOne = (req, res, next) => {
  const { id } = req.query;
  new Job()
    .readOne(id)
    .then(rel => {
      res.status(200).json({ message: 'get job success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
module.exports.readAll = (req, res, next) => {
  new Job(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
  )
    .readAll()
    .then(rel => {
      res.status(200).json({ message: 'get all job success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}
module.exports.delete = (req, res, next) => {
  const { _id } = req.body
  new Job(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
  )
    .delete(_id)
    .then(rel => {
      res.status(200).json({ message: 'delete success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}

module.exports.updateOne = (req, res, next) => {
  const { _id, name, description, requirement, hourWorking, postingDate, deadline, salary, locationWorking, idOccupation, idCompany } = req.body;
  const job = new jobSchema()
  job._id = _id
  job.name = name
  job.description = description
  job.requirement = requirement
  job.hourWorking = hourWorking
  job.postingDate = postingDate
  job.deadline = deadline
  job.salary = salary
  job.locationWorking = locationWorking
  job.idOccupation = idOccupation
  job.idCompany = idCompany
  new Job()
    .update(job)
    .then((rel) => { res.status(200).json({ message: 'update job success', success: true, job: rel }) })
    .catch(err => { res.status(500).json({ message: err.message, success: err.isSuccess }) })
}

module.exports.getAllSortByDate = (req, res, next) => {
  new Job(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
  )
    .getSortByDate()
    .then(rel => {
      res.status(200).json({ message: 'get all job success', success: true, data: rel })
    })
    .catch(err => res.status(500).json({ message: err.message, success: err.isSuccess }))
}





