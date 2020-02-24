import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import json from 'koa-json'
import jwt from 'jsonwebtoken'
import cluster from 'cluster'
import os from 'os'

import goods_routes from './routes/Goods'
import users_routes from './routes/Users'
import stat_routes from './routes/Stat'

const app = new Koa()
const config = require('../../config.json')

if (cluster.isMaster) {
    var numWorkers = os.cpus().length;

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', () => {
        cluster.fork();
    });
} else {

    app.use(async (ctx, next) => {
        console.log(ctx.url);
        console.log(ctx.method);
        if (ctx.url == '/users/login') {
            return next()
        } else {
            if (ctx.get('authorization')) {
                let headerToken = ctx.get('authorization')
                let token = headerToken.split(' ')[1]

                try {
                    if (jwt.verify(token, config.secret_token)) {
                        return next()
                    } else {
                        ctx.body = 'Authorization failed'
                    }
                } catch (err) {
                    ctx.body = `Error: ${err.message}`
                }
            } else {
                ctx.body = 'Authorization required'
            }
        }
    })

    app.use(bodyParser())

    app
        .use(stat_routes.routes())
        .use(stat_routes.allowedMethods())
        .use(goods_routes.routes())
        .use(goods_routes.allowedMethods())
        .use(users_routes.routes())
        .use(users_routes.allowedMethods())

    app.use(json())

    app.listen(config.ExternalServiceHostPort)

}