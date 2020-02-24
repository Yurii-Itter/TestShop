import Koa from 'koa'
import KoaRouter from 'koa-router'
import views from 'koa-views'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import path from 'path'
import request from 'request-promise'
import ls from 'local-storage'
import cluster from 'cluster'
import os from 'os'

const app = new Koa();
const router = new KoaRouter()

const config = require('../../config.json')

let setLs = (token) => {
    ls('TestShopToken', token)
}

let checkLs = () => {
    return ls('TestShopToken')
}

if (cluster.isMaster) {

    let numWorkers = os.cpus().length;

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', function () {
        cluster.fork();
    });

} else {
    app.use(bodyParser())
    app.use(serve(path.resolve(__dirname, '../public')))
    app.use(views(path.resolve(__dirname, '../pages'), { extension: 'pug' }));

    router.get('/', async ctx => {
        await ctx.render('login.pug', { error: false })
    })

    router.post('/', async ctx => {

        let { login, password } = ctx.request.body

        try {
            let response = await request({
                url: config.ExternalServiceHost + ':' + config.ExternalServiceHostPort + '/user/signin',
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                json: true,
                body: { login: login, password: password }
            })

            setLs(response.token)
            await ctx.redirect('/goods')

        } catch (err) {
            await ctx.render('login.pug', { error: true })
        }

    })

    router.get('/goods', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            try {
                let res = await request({
                    url: config.ExternalServiceHost + ':' + config.ExternalServiceHostPort + '/goods',
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + checkLs(),
                        'content-type': 'application/json'
                    },
                })

                let response = JSON.parse(res)

                await ctx.render('goods.pug', { response: response })

            } catch (err) {
                ctx.body = err.statusCode
            }

        }
    })

    router.get('/goods/create', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            await ctx.render('crt_goods.pug', { error: false })
        }
    })

    router.post('/goods/create', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            let { name, category, price, amount } = ctx.request.body

            try {
                request({
                    url: config.ExternalServiceHost + ':' + config.ExternalServiceHostPort + '/goods/create',
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + checkLs(),
                        'content-type': 'application/json'
                    },
                    json: true,
                    body: { name: name, category: category, price: price, amount: amount }
                })

                ctx.redirect('/goods')

            } catch (err) {
                await ctx.render('crt_goods.pug', { error: true })
            }
        }
    })

    router.get('/goods/delete', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            try {
                request({
                    url: config.ExternalServiceHost + ':' + config.ExternalServiceHostPort + '/goods/delete',
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + checkLs(),
                        'content-type': 'application/json'
                    },
                    json: true,
                    body: { id: ctx.query.id }
                })

                ctx.redirect('/goods')

            } catch (err) {
                ctx.body = err.statusCode
            }
        }
    })

    router.get('/goods/update', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            await ctx.render('mdf_goods.pug', { data: ctx.query })
        }
    })

    router.post('/goods/update', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            let { id, name, category, price, amount } = ctx.request.body

            try {
                request({
                    url: config.ExternalServiceHost + ':' + config.ExternalServiceHostPort + '/goods/update',
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + checkLs(),
                        'content-type': 'application/json'
                    },
                    json: true,
                    body: { id: id, name: name, category: category, price: price, amount: amount }
                })

                ctx.redirect('/goods')

            } catch (err) {
                ctx.body = err.statusCode
            }
        }
    })

    router.get('/stat', async ctx => {
        if (checkLs() == null) {
            ctx.redirect('/')
        } else {
            try {
                let response = await request({
                    url: config.ExternalServiceHost + ':' + config.ExternalServiceHostPort + '/stat/all',
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + checkLs(),
                        'content-type': 'application/json'
                    }
                })

                await ctx.render('stat.pug', { stats: JSON.parse(response) })

            } catch (err) {
                ctx.body = err.statusCode
            }
        }
    })

    app
        .use(router.routes())
        .use(router.allowedMethods())

    app.listen(80)
}