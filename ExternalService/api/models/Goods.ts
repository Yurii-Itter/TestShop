import mongoose from './database'

const Goods = mongoose.model('Goods', new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: {type: String, required: [true, 'Name field is obligatory']},
    category: {type: String, required: [true, 'Category field is obligatory']},
    price: {type: Number, validate: /\d+(\.\d{2})?/, required: [true, 'Price field is obligatory']},
    amount: {type: Number, required: [true, 'Amount field is obligatory']}
}));

export default Goods;