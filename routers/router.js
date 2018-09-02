const Router = require('koa-router')
const router = new Router

//设置主页
router.get("/", async (ctx) => {
    await ctx.render("index", {
        title: "寒光博客",
        session: {
            role: 666
        }
    })
})

//主要用来处理 用户登录 注册
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    // show 为 true 显示注册否则显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render("register", {show})
})

module.exports = router