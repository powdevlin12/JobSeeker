const companySchema = require('../schemas/company.schema')

module.exports = class Job {
  id
  #name
  #totalEmployee
  #type
  #about
  #phone
  #location
  #idUser
  constructor(id, name, totalEmployee, type, about, phone, location, idUser) {
    this.id = id
    this.#name = name
    this.#totalEmployee = totalEmployee
    this.#type = type
    this.#about = about
    this.#phone = phone
    this.#location = location
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
    return new Promise((resolve, reject) => {
      return companySchema.find({})
        .then((rel) => { resolve(rel) })
        .catch((err) => { reject(err) })
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