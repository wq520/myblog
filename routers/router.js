const Router = require('koa-router')
// 拿到操作user表的逻辑对象
const user = require('../control/user')
const router = new Router

// 设置主页
router.get("/", user.keepLog, async (ctx) => {
    await ctx.render("index", {
        title: "寒光博客",
        session: ctx.session
    })
})

// 主要用来处理 用户登录 注册
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    // show 为 true 显示注册否则显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render("register", {show})
})

// 注册用户 路由
router.post("/user/reg", user.reg)

// 用户登录 路由
router.post("/user/login", user.login)

// 用户退出
router.get("/user/logout", user.logout)

module.exports = router