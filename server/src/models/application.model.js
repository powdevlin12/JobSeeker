const applicationSchema = require("../schemas/application.schema")

module.exports = class ApplicationModel {
    #id
    #idJobSeeker
    #idCompany
    #cv
    #submitDate

    constructor(id, idJobSeeker, idCompany, cv, submitDate) {
        this.#id = id
        this.#idJobSeeker = idJobSeeker
        this.#idCompany = idCompany
        this.#cv = cv
        this.#submitDate = submitDate
    }
    create = () => {
        return new Promise((resolve, reject) => {
            const app = new applicationSchema()
            app.idJobSeeker = this.#idJobSeeker
            app.idCompany = this.#idCompany
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
    getAll = (idCompany) => {
        return new Promise((resolve, reject) => {
            applicationSchema.find({ idCompany: idCompany })
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
}