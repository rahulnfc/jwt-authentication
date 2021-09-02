const mongoClient = require('mongodb').MongoClient;
const state = { db: null };

module.exports.connect = (done) => {
    const url = process.env.DBURI;
    const dbname = process.env.DBNAME;

    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, data) => {
            if (err) return done(data);
            state.db = data.db(dbname);
            done();
        }
    )
}

module.exports.get = () => {
    return state.db;
}