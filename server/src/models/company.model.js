const { default: mongoose } = require('mongoose')
const companySchema = require('../schemas/company.schema')
const jobSchema = require('../schemas/job.schema')

module.exports = class Job {
  id
  #name
  #totalEmployee
  #type
  #about
  #phone
  #location
  #idUser
  #isDelete
  constructor(id, name, totalEmployee, type, about, phone, isDelete, location, idUser) {
    this.id = id
    this.#name = name
    this.#totalEmployee = totalEmployee
    this.#type = type
    this.#about = about
    this.#phone = phone
    this.#location = location
    this.#isDelete = isDelete
    this.#idUser = idUser
  }
  create = () => {
    return new Promise(async (resolve, reject) => {
      const com = new companySchema()
      com.name = this.#name
      com.totalEmployee = this.#totalEmployee
      com.type = this.#type
      com.about = this.#about
      com.phone = this.#phone
      com.location = this.#location
      com.isDelete = this.#isDelete
      com.idUser = this.#idUser
      com.save()
        .then((rel) => resolve(rel))
        .catch((err) => reject(err))
    })
  }
  delete = (id) => {
    return new Promise(async (resolve, reject) => {
      companySchema.findByIdAndDelete(id)
        .then(rel => resolve(rel))
        .catch(err => reject(err))
    })
  }
  readAll = () => {
    //need paging
    return new Promise((resolve, reject) => {
      return companySchema.find({})
        .then(async (rel) => {
          for (let i = 0; i < rel.length; i++) {
            rel[i] = rel[i].toObject();
            var numJob = await jobSchema.find({ idCompany: mongoose.Types.ObjectId(rel[i]._id) })
            rel[i]['numJob'] = numJob.length
          }
          resolve(rel)
        })
        .catch((err) => { reject(err) })
    })
  }
  getPaging = (page) => {
    return new Promise(async (resolve, reject) => {
      try {
        var limit = 20
        var total = await companySchema.countDocuments();
        var page_total = Math.ceil(total / limit)
        var result = await companySchema.find({}).skip(limit * page).limit(limit)
        if (page < page_total) {
          result.next = page + 1
        }
        if (page > 0) {
          result.previous = page - 1
        }
        resolve(result)
      }
      catch (e) {
        reject(e)
      }
    })
  }
  readOne = (id) => {
    return new Promise((resolve, reject) => {
      return companySchema.findById(id)
        .then((rel) => { resolve(rel) })
        .catch((err) => { reject(err) })
    })
  }
  update = (company) => {
    return new Promise((resolve, reject) => {
      companySchema.findByIdAndUpdate(company._id, company)
        .then(rel => resolve(company))
        .catch(err => reject(err))
    })
  }
}