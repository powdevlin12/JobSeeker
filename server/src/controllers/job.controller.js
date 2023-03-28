
const Job = require('../models/job.model');
const jobSchema = require('../schemas/job.schema');
const jwt = require('jsonwebtoken');
const { uploadImage } = require('../services/uploadImage.service');
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
  const token = req.header('Authorization')
  new Job()
    .readOne(id, token)
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
    .catch(err => res.status(500).json({ message: err.message, success: false }))
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
    .catch(err => res.status(500).json({ message: err.message, success: false }))
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
  job.status = true;
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


// loc job  NGUOI TIM VIEC
module.exports.getFilterJob = (req, res, next) => {
  new Job()
    .filterJob(req.body)
    .then((rel) => { return res.status(200).json({ success: true, message: "filter job success", data: rel }) })
    .catch(err => res.status(404).json({ message: "filter job fail", success: false, error: err }))
}
//Tim kiem viec lam
module.exports.getSearchJob = (req, res, next) => {
  const condition = req.body
  //console.log(key)
  new Job()
    .findJob(condition)
    .then((rel) => { return res.status(200).json({ success: true, message: "search job success", data: rel }) })
    .catch(err => res.status(404).json({ message: "search job fail", success: false, error: err }))
}
//xem tat ca cac job da dang doi' voi NHA TUYEN DUNG
module.exports.getAllJobModerator = (req, res, next) => {
  const token = req.header('Authorization')
  if (token) {
    const accessToken = token.split(" ")[1]
    try {
      var decode = jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY)
      if (decode) {
        //console.log(decode)
        new Job()
          .getAllJobModerator(decode._id)
          .then((rel) => res.status(200).json({ success: true, message: "get job success", data: rel }))
          .catch(err => res.status(404).json({ message: "get job fail", success: false, error: err }))
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Server is error", isSuccess: false })
    }
  }

}
module.exports.uploadImage = (req, res, next) => {
  console.log(req.file.filename);
}


module.exports.listJobByCompany = (req, res, next) => {
  try {
    var companyId = req.params.id
    new Job()
      .listJobByCompany(companyId)
      .then((data) => { res.status(200).json({ message: "get success", data: data, isSuccess: true }) })
      .catch((err) => { res.status(500).json({ message: err.message, isSuccess: false }) })

  }
  catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false })
  }
}

