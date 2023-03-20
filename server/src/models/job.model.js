const jobSchema = require('../schemas/job.schema')
const companySchema = require('../schemas/company.schema')

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
        .populate('idCompany')
        .populate('idOccupation')
        .then((job) => { resolve(job) })
        .catch((err) => { reject(err) })
    })
  }
  readOne = (id) => {
    return new Promise((resolve, reject) => {
      console.log('id ' + id)
      jobSchema.findById(id)
        .populate('idCompany')
        .populate('idOccupation')
        .then((job) => { console.log('job ' + job); return resolve(job) })
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
  //lọc job theo các tiêu chí sắp xếp mới nhất, tìm theo locationWorking, idCompany, idOccupation
  filterJob = (condition) => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ deadline: { $gt: new Date() } }).sort({ postingDate: -1 })
        .populate('idOccupation')
        .populate('idCompany')
        .then(
          rel => {
            //console.log(rel)
            for (let i in condition) {
              //console.log(i)
              switch (i) {
                case 'locationWorking':
                  //console.log(condition[i])
                  rel = rel.filter(item => item.locationWorking == condition[i])
                  //return item.locationWorking.some(place => condition[i].includes(place.toString())))
                  break;
                case 'idCompany':
                  //console.log(condition[i])
                  rel = rel.filter(item => item.idCompany._id.toString() == condition[i])
                  break;
                case 'idOccupation':
                  //console.log(condition[i])
                  rel = rel.filter(item => item.idOccupation._id.toString() == condition[i])
                  // return item.idOccupation.some(occupation => condition[i].includes(occupation.toString()))
                  break;
                default:
                  break;
              }
            }
            return resolve(rel)
          }
        )
        .catch(err => reject(err))
    })
  }
  //xem tất cả job đã đăng(dành cho ng tuyển dụng)
  getAllJobModerator = (userId) => {
    console.log(userId)
    return new Promise(async (resolve, reject) => {
      var company = await companySchema.findOne({ idUser: userId }).exec()
      //console.log(company._id.toString())
      jobSchema.find({ idCompany: company._id.toString() })
        .then((rel) => {
          //console.log(rel)
          return resolve(rel)
        })
        .catch((err) => reject(err))
    })
  }
  // vua tim kiem vua nhan theo id
  findJob = (condition) => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ name: { $regex: condition.key.toString() }, deadline: { $gt: new Date() } })
        .then((rel) => {
          for (let i in condition) {
            switch (i) {
              case 'localWorking':
                rel = rel.filter(item => item.locationWorking in condition[i])
                break;
              case 'idCompany':
                rel = rel.filter(item => item.idCompany == condition[i])
                break;
              case 'idOccupation':
                rel = rel.filter(item => item.idOccupation in condition[i])
                break;
              default:
                break;
            }
          }
          resolve(rel);
        })
        .catch((err) => reject(err))
    })
  }

  listJobByCompany(companyId) {
    return new Promise((resolve, reject) => {
      jobSchema.find({ idCompany: companyId })
        .populate('idCompany')
        .populate('idOccupation')
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
}