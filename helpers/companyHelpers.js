const bcrypt = require('bcrypt');
const db = require('../config/database/connection');
const collection = require('../config/database/collection');

module.exports = {
    doSignup: (companyData) => {
        return new Promise(async (resolve, reject) => {
            const emailExist = await db.get().collection(collection.COMPANY).findOne({ email: companyData.email });
            if (!emailExist) {
                companyData.password = await bcrypt.hash(companyData.password, 10);
                companyData.createdAt = Date.now();
                db.get().collection(collection.COMPANY).insertOne(companyData).then((data) => {
                    resolve(data.ops[0]);
                });
            } else {
                reject();
            }
        });
    },
    doLogin: async (companyData) => {
        const company = await db.get().collection(collection.COMPANY).findOne({ email: companyData.email });
        if (company) {
            if (company.status === 'blocked') {
                return { blocked: true }
            } else if (await bcrypt.compare(companyData.password, company.password)) {
                return { company }
            } else {
                return { passwordErr: true }
            }
        }
        return { loginErr: true }
    },
    findCompany: async (id) => {
        const company = await db.get().collection(collection.COMPANY).findOne(id);
        return company;
    },
    createJob: (jobData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.JOB).insertOne(jobData).then((data) => {
                resolve(data.ops[0]);
            });
        });
    }
}
