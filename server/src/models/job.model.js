const jobSchema = require('../schemas/job.schema')

module.exports = class Job {
  id
  #name
  #description
  #requirement
  #hourWorking
  #postingDate
  #deadline
  #salary
  #locationWorking
  #idOccupation
  #idCompany
  constructor(id, name, description, requirement, hourworking, postingdate, deadline, salary, locationworking, idoccupation, idcompany) {
    this.id = id
    this.#name = name
    this.#description = description
    this.#requirement = requirement
    this.#hourWorking = hourworking
    this.#postingDate = postingdate
    this.#deadline = deadline
    this.#salary = salary
    this.#locationWorking = locationworking
    this.#idOccupation = idoccupation
    this.#idCompany = idcompany
  }
  create = () => {
    return new Promise(async (resolve, reject) => {
      const job = new jobSchema()
      job.name = this.#name
      job.description = this.#description
      job.requirement = this.#requirement
      job.hourWorking = this.#hourWorking
      job.postingDate = this.#postingDate
      job.deadline = this.#deadline
      job.salary = this.#salary
      job.locationWorking = this.#locationWorking
      job.idOccupation = this.#idOccupation
      job.idCompany = this.#idCompany
      job.save()
        .then((rel) => resolve(rel))
        .catch((err) => { reject(err) })
    })
  }
  delete = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        var job = jobSchema.findById(id);
        job.status = false;
        jobSchema.findByIdAndUpdate(job)
        resolve(job)
      } catch (error) {
        reject(error)
      }
    })
  }
  readAll = () => {
    return new Promise((resolve, reject) => {
      return jobSchema.find({})
        .then((job) => { resolve(job) })
        .catch((err) => { reject(err) })
    })
  }
  readOne = (id) => {
    return new Promise((resolve, reject) => {
      console.log('id ' + id)
      jobSchema.findById(id)
        .then((job) => { console.log('job ' + job); return resolve(job) })
        .catch((err) => reject(err))
    })
  }
  delete = (id) => {
    return new Promise((resolve, reject) => {
      jobSchema.findByIdAndDelete(id)
        .then((rel) => { resolve(rel) })
        .catch((err) => reject(err))
    })
  }
  update = (job) => {
    return new Promise((resolve, reject) => {
      jobSchema.findByIdAndUpdate(job._id, job)
        .then(rel => resolve(job))
        .catch(err => reject(err))
    })
  }
  getSortByDate = () => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ deadline: { $gte: new Date() } }).sort({ postingDate: -1 })
        .then(rel => resolve(rel))
        .catch(err => reject(err))
    })
  }
}