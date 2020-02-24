import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

import Users from '../models/Users'
const config= require('../../../config.json')

export const login = async (ctx) => {
    
    let { login, password } = ctx.request.body

    let fnd = await Users.findOne({ login: login })

    let p_hash = fnd.get('pwd')

    let match = await bcrypt.compare(password, p_hash);

    if (fnd && match) {
        ctx.body = {
            result: 'Login Successful', token: jsonwebtoken.sign({
                data: login
            }, config.secret_token)
        }
        ctx.status = 200
    } else {
        ctx.body = { result: 'Login Failure' }
        ctx.status = 401
    }
}