import mongoose from 'mongoose'
const config = require('../../../config.json')

mongoose.connect(`mongodb://${config.mongodb_host}:${config.mongodb_port}/${config.mongodb_database}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, user: config.mongodb_user, pass: config.mongodb_pass }).catch(error => console.log(error));

export default mongoose