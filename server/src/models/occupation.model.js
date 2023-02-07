const occupationSchema = require('../schemas/occupation.schema')

module.exports = class Job {
  id
  #name
  constructor(id, name) {
    this.id = id
    this.#name = name
  }
  create = () => {
    return new Promise(async (resolve, reject) => {
      const occup = new occupationSchema()
      occup.name = this.#name
      occup.save()
        .then((rel) => resolve(rel))
        .catch((err) => { reject(err) })
    })
  }
  delete = (id) => {
    return new Promise(async (resolve, reject) => {
      occupationSchema.findByIdAndDelete(id)
        .then((rel) => resolve(rel))
        .catch((rel) => reject(rel))
    })
  }
  readAll = () => {
    return new Promise((resolve, reject) => {
      return occupationSchema.find({})
        .then((occup) => { resolve(occup) })
        .catch((err) => { reject(err) })
    })
  }
  readOne = (id) => {
    return new Promise((resolve, reject) => {
      return occupationSchema.findById(id)
        .then((occup) => { resolve(occup) })
        .catch((err) => { reject(err) })
    })
  }
  update = (occupation) => {
    return new Promise((resolve, reject) => {
      occupationSchema.findByIdAndUpdate(occupation._id, occupation)
        .then(rel => resolve(occupation))
        .catch(err => reject(err))
    })
  }
}