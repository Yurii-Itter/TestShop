import Goods from '../models/Goods'

export const all = async (ctx) => {
    let all = await Goods.aggregate()
        .group({ _id: "$category", amount: { $sum: 1 }, avgPrice: { $avg: "$price" }, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" }, sum: { $sum: { $multiply: ["$price", "$amount"] } } })

    ctx.body = all
}

// test