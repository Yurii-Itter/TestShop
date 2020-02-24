import Router from 'koa-router'

import * as stat_constroller from '../controllers/Stat'

const Stat = new Router({
    prefix: '/stat'
})

Stat.get('/all', stat_constroller.all)

export default Stat