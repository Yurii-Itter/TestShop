import Goods from '../models/Goods'
import mongoose from '../models/database'

export const read = async ctx => {
    ctx.body = await Goods.find()
}

export const create = async (ctx) => {

    let { name, category, price, amount } = ctx.request.body

    let crt = new Goods({
        _id: mongoose.Types.ObjectId(),
        name: name,
        category: category,
        price: price,
        amount: amount
    }).save()

    let res = await crt
        .then(() => { return { result: 'success', status: 201 } })
        .catch(err => { return { result: 'failure', status: 400, error: err.message } })

    ctx.body = res
    ctx.status = 201
}

export const remove = async (ctx) => {
    let rem = Goods.findByIdAndDelete(ctx.request.body.id)

    let res = await rem
        .then(() => { return { result: 'success', status: 200 } })
        .catch(err => { return { result: 'failure', status: 404, error: err.message } })

    ctx.body = res
    ctx.status = res.status
}

export const update = async (ctx) => {

    let { id, name, category, price, amount } = ctx.request.body

    let upd = Goods.findByIdAndUpdate(id, {
        name: name,
        category: category,
        price: price,
        amount: amount
    })

    let res = await upd
        .then(() => { return { result: 'success', status: 200 } })
        .catch(err => {
            return {
                result: 'failure', status: () => {
                    if (err.name === 'ValidationError') {
                        return 400
                    } else {
                        return 404
                    }
                }, error: err.message
            }
        })

    ctx.body = res
    ctx.status = res.status
}