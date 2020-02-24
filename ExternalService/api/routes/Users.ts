import Router from 'koa-router'

import * as users_constroller from '../controllers/Users'

const Users = new Router({
    prefix: '/users'
})

Users.post('/login', users_constroller.login)

export default Users