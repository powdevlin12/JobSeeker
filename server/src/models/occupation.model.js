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
  readAll = (page) => {
    return new Promise(async (resolve, reject) => {
      try {
        const page_limit = process.env.PAGE_LIMIT
        const occupation_total = await occupationSchema.countDocuments()
        const page_total = Math.ceil(occupation_total / page_limit)
        if (page == undefined) {
          resolve({ data: await occupationSchema.find({}) })
        }
        page = Number.parseInt(page)
        if (page >= 0 && page <= page_total) {
          resolve({ data: await occupationSchema.find({}).skip(page * page_limit).limit(page_limit), page_total: page_total, current_page: page, page_limit: page_limit })
        }
        else reject({ message: "can't get list application" })
      } catch (error) {
        reject(error)
      }
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