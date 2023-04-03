const jobSchema = require('../schemas/job.schema')
const companySchema = require('../schemas/company.schema')
const applicationSchema = require('../schemas/application.schema')
const { default: mongoose } = require('mongoose')
const { verifyToken, getUserIdFromJWTToken } = require('../middlewares')
const { chuanhoadaucau } = require('../services/standardVietNamWork')
const occupationSchema = require('../schemas/occupation.schema')
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
      const company = await companySchema.findById(this.#idCompany)
      const occupation = await occupationSchema.findById(this.#idOccupation)
      if (company.isDelete || company == null) reject({ message: "company is undefined" })
      if (occupation == null || occupation.isDelete) reject({ message: "Occupattion is undefined" })
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
        var jobFind = await jobSchema.findById(id);
        if (!jobFind.status) {
          reject({ message: "job already deleted" })
        } else {
          jobSchema.findByIdAndUpdate(id, { status: false })
            .then((res) => resolve(res))
            .catch(err => reject(err))
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  readAll = (page) => {
    return new Promise(async (resolve, reject) => {
      const page_limit = process.env.PAGE_LIMIT
      const total_job = await jobSchema.countDocuments()
      const page_total = Math.ceil(total_job / page_limit)
      if (page === undefined) {
        return jobSchema.find({}).limit(page_limit)
          .populate('idCompany')
          .populate('idOccupation')
          .then((job) => { return resolve({ data: job, page_total: page_total, current_page: 0, job_per_page: Number.parseInt(page_limit) }) })
          .catch((err) => { reject(err) })
      }
      page = Number.parseInt(page)
      if (page >= 0 && page <= page_total) {
        return jobSchema.find({}).skip(page).limit(page_limit)
          .populate('idCompany')
          .populate('idOccupation')
          .then((job) => { return resolve({ data: job, page_total: page_total, current_page: page, job_per_page: Number.parseInt(page_limit) }) })
          .catch((err) => { reject(err) })
      }
      else reject({ message: "can't get list job" })
    })
  }
  readOne = (id, token) => {
    return new Promise((resolve, reject) => {
      try {
        const userId = getUserIdFromJWTToken(token)
        //console.log(userId)
        if (userId.success) {
          jobSchema.findById(id)
            .populate('idCompany')
            .populate('idOccupation')
            //console.log('job ' + job);
            .then(async (job) => {
              job = job.toObject()
              var numApply = await applicationSchema.find({ idJob: mongoose.Types.ObjectId(job._id) })
              var isApply = await applicationSchema.find({ idJob: mongoose.Types.ObjectId(job._id), idJobSeeker: mongoose.Types.ObjectId(userId.message) })
              if (isApply.length > 0) job.isApply = true;
              else job.isApply = false;
              job['numApply'] = numApply.length;
              //console.log('job: ' + job)
              return resolve(job)
            })
            .catch((err) => reject(err))
        }
      }
      catch (e) {
        jobSchema.findById(id)
          .populate('idCompany')
          .populate('idOccupation')
          //console.log('job ' + job);
          .then(async (job) => {
            var numApply = await applicationSchema.find({ idJob: mongoose.Types.ObjectId(job._id) })
            job = job.toObject()
            job['numApply'] = numApply.length;
            //console.log('job: ' + job)
            return resolve(job)
          })
          .catch((err) => reject(err))
      }
    })
  }
  update = (job) => {
    return new Promise(async (resolve, reject) => {
      var jobFind = await jobSchema.findById(job._id);
      if (!jobFind.status) {
        reject({ message: "this job was deleted. Can't update." })
      } else {
        jobSchema.findByIdAndUpdate(job._id, job)
          .then(rel => resolve(job))
          .catch(err => reject(err))
      }

    })
  }
  getSortByDate = () => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ deadline: { $gte: new Date() }, status: true }).sort({ postingDate: -1 })
        .populate('idOccupation')
        .populate('idCompany')
        .then(rel => resolve(rel))
        .catch(err => reject(err))
    })
  }
  //lọc job theo các tiêu chí sắp xếp mới nhất, tìm theo locationWorking, idCompany, idOccupation
  searchByKey = (key) => {
    return new Promise((resolve, reject) => {
      jobSchema.find({ status: true, deadline: { $gt: new Date() } }).sort({ postingDate: -1 })
        .populate('idOccupation')
        .populate('idCompany')
        .then(
          rel => {
            rel = rel.filter(item =>
            (
              (
                item.idCompany != null && item.idOccupation != null
              ) &&
              (chuanhoadaucau(item.name).toLowerCase().includes(chuanhoadaucau(key).toLowerCase()) ||
                chuanhoadaucau(item.requirement).toLowerCase().includes(chuanhoadaucau(key).toLowerCase() ||
                  chuanhoadaucau(item.idCompany.name).toLowerCase().includes(chuanhoadaucau(key).toLowerCase()) ||
                  chuanhoadaucau(item.idOccupation.name).toLowerCase().includes(chuanhoadaucau(key).toLowerCase()))
              )
            )
            )
            rel = rel.map(function (item) {
              return { _id: item._id, name: item.name }
            })
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
    return new Promise(async (resolve, reject) => {
      jobSchema.find({ deadline: { $gt: new Date() }, status: true })
        .populate('idOccupation')
        .populate('idCompany')
        .then((rel) => {
          for (let i in condition) {
            if (i.idCompany == null || i.idOccupation == null) { continue; }
            switch (i) {
              case 'locationWorking':
                if (condition[i].length > 0) {
                  for (let tmp = 0; tmp < condition[i].length; tmp++) condition[i][tmp] = chuanhoadaucau(condition[i][tmp]).toLowerCase();
                  rel = rel.filter(item => condition[i].includes(chuanhoadaucau(item.locationWorking).toLowerCase()))
                }
                break;
              case 'idCompany':
                if (condition[i].length > 0) {
                  rel = rel.filter(item => condition[i].includes(item.idCompany._id.toString()))
                }
                break;
              case 'idOccupation':
                if (condition[i].length > 0) {
                  rel = rel.filter(item => condition[i].includes(item.idOccupation._id.toString()))
                }
                break;
              default:
                break;
            }
          }
          rel = rel.filter(i =>
            (
              i.idCompany != null && i.idOccupation != null
            )
            &&
            (
              chuanhoadaucau(i.name.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.idCompany.name.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.idOccupation.name.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase())) ||
              chuanhoadaucau(i.locationWorking.toLowerCase()).includes(chuanhoadaucau(condition.key.toString().toLowerCase()))
            )
          );
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