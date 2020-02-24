import mongoose from './database'

const User = mongoose.model('User', new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    login: { type: String, required: true },
    pwd: { type: String, require: true }
}));

export default User;