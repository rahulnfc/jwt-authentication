const bcrypt = require('bcrypt');
const db = require('../config/database/connection');
const collection = require('../config/database/collection');

module.exports = {
    doLogin: async (adminData) => {
        const admin = await db.get().collection(collection.ADMIN).findOne({ email: adminData.email });
        if (admin) {
            if (await bcrypt.compare(adminData.password, admin.password)) {
                return { admin }
            } else {
                return { passwordErr: true }
            }
        }
        return { loginErr: true }
    }
}
