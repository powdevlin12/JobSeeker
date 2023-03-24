const { default: mongoose } = require("mongoose")
const applicationSchema = require("../schemas/application.schema")

module.exports = class ApplicationModel {
    #id
    #idJobSeeker
    #idJob
    #cv
    #submitDate

    constructor(id, idJobSeeker, idJob, cv, submitDate) {
        this.#id = id
        this.#idJobSeeker = idJobSeeker
        this.#idJob = idJob
        this.#cv = cv
        this.#submitDate = submitDate
    }
    create = () => {
        return new Promise((resolve, reject) => {
            const app = new applicationSchema()
            app.idJobSeeker = this.#idJobSeeker
            app.idJob = this.#idJob
            app.cv = this.#cv
            app.submitDate = this.#submitDate
            app.save()
                .then((rel) => resolve(rel))
                .catch(err => reject(err))
        })
    }
    confirm = () => {
        return new Promise((resolve, reject) => {

        })
    }
    reject = () => {
        return new Promise((resolve, reject) => {

        })
    }
    getAll = (idJob) => {
        return new Promise((resolve, reject) => {
            applicationSchema.find({ idJob: idJob })
                .then((rel) => resolve(rel))
                .catch(err => reject(err))
        })
    }
    getOne = (id) => {
        return new Promise((resolve, reject) => {
            applicationSchema.findById(id)
                .then((rel) => resolve(rel))
                .catch(err => reject(err))
        })
    }
    getAllByJobId = (jobId) => {
        return new Promise(async (resolve, reject) => {
            //check xem user da~ apply chua, neu roi` thi tra ve false
            // const apply = await applicationSchema.find({ idJob: jobId}).exec()
            // if (apply) {
            //     return reject("You already apply this job")
            // }
            applicationSchema.find({ idJob: jobId })
                .populate('idJobSeeker')
                .then((rel) => {
                    //console.log(rel)
                    return resolve(rel)
                })
                .catch((err) => reject(err))
        })
    }
    // danh sach cong viec da apply
    getAllByUserId = (userId) => {
        //console.log(userId)
        return new Promise(async (resolve, reject) => {
            applicationSchema.find({ idJobSeeker: mongoose.Types.ObjectId(userId) })
                .populate({
                    path: 'idJob',
                    populate: { path: 'idCompany' }
                })
                .then((res) => { return resolve(res) })
                .catch(err => reject(err))
        })
    }
}