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
            app.submitDate = new Date()
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
            applicationSchema.find({})
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
    getAllByJobId = (jobId, page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await applicationSchema.find({ idJob: jobId }).populate('idJobSeeker');
                const page_limit = process.env.PAGE_LIMIT
                const applies_total = result.length
                const page_total = Math.ceil(applies_total / page_limit)
                if (page == undefined) {
                    resolve({ data: result.slice(0, page_limit), page_total: page_total, current_page: 0, page_limit: page_limit })
                }
                page = Number.parseInt(page)
                if (page >= 0 && page <= page_total) {
                    resolve({ data: result.slice(page_limit * page + 1, page_limit * (page + 1)), page_total: page_total, current_page: page, page_limit: page_limit })
                }
                else reject({ message: "can't get list application" })
            } catch (error) {
                reject(error)
            }
            //check xem user da~ apply chua, neu roi` thi tra ve false
            // const apply = await applicationSchema.find({ idJob: jobId}).exec()
            // if (apply) {
            //     return reject("You already apply this job")
            // }
        })
    }
    // danh sach cong viec da apply
    getAllByUserId = (userId, page) => {

        //console.log(userId)
        return new Promise(async (resolve, reject) => {
            try {
                const result = await applicationSchema.find({ idJobSeeker: mongoose.Types.ObjectId(userId) })
                    .populate({ path: 'idJob', populate: { path: 'idCompany' } });
                const page_limit = process.env.PAGE_LIMIT
                const applies_total = result.length
                const page_total = Math.ceil(applies_total / page_limit)
                if (page == undefined) {
                    resolve({ data: result.slice(0, page_limit), page_total: page_total, current_page: 0, page_limit: page_limit })
                }
                page = Number.parseInt(page)
                if (page >= 0 && page <= page_total) {
                    resolve({ data: result.slice(page_limit * page + 1, page_limit * (page + 1)), page_total: page_total, current_page: 0, page_limit: page_limit })
                }
                else reject({ message: "can't get list application" })
            } catch (error) {
                reject(error)
            }
        })
    }
}