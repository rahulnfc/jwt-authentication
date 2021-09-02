const bcrypt = require('bcrypt');
const db = require('../config/database/connection');
const collection = require('../config/database/collection');

module.exports = {
    doSignup: (applicantData) => {
        return new Promise(async (resolve, reject) => {
            const emailExist = await db.get().collection(collection.APPLICANT).findOne({ email: applicantData.email });
            if (!emailExist) {
                applicantData.password = await bcrypt.hash(applicantData.password, 10);
                applicantData.createdAt = Date.now();
                db.get().collection(collection.APPLICANT).insertOne(applicantData).then((data) => {
                    resolve(data.ops[0]);
                });
            } else {
                reject();
            }
        });
    },
    doLogin: async (applicantData) => {
        const applicant = await db.get().collection(collection.APPLICANT).findOne({ email: applicantData.email });
        if (applicant) {
            if (applicant.status === 'blocked') {
                return { blocked: true }
            } else if (await bcrypt.compare(applicantData.password, applicant.password)) {
                return { applicant }
            } else {
                return { passwordErr: true }
            }
        }
        return { loginErr: true }
    },
    findApplicant: async (id) => {
        const applicant = await db.get().collection(collection.APPLICANT).findOne(id);
        return applicant;
    }
}
