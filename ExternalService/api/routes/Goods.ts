import Router from 'koa-router'

import * as goods_controller from '../controllers/Goods'

const Goods = new Router({
    prefix: '/goods'
})

Goods
    .get('/', goods_controller.read)
    .post('/create', goods_controller.create)
    .put('/update', goods_controller.update)
    .delete('/delete', goods_controller.remove)

export default Goods