const Router = require('koa-router')
// 拿到操作user表的逻辑对象
const user = require('../control/user')
const article = require('../control/article')
const comment = require("../control/comment");
const admin = require("../control/admin");
const router = new Router

// 设置主页
router.get("/", user.keepLog, article.getList)

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

// 文章的发表页面
router.get("/article", user.keepLog, article.addPage)

// 文章添加
router.post("/article", user.keepLog, article.add)

// 文章列表分页 路由
router.get("/page/:id", article.getList)

// 文章详情页 路由
router.get("/article/:id", user.keepLog, article.details)

// 发表评论
router.post("/comment", user.keepLog, comment.save)

// 后台管理 路由
router.get("/admin/:id", user.keepLog, admin.index)

router.get("*", async ctx => {
    await ctx.render("404",{
        title: "404"
    })
})

module.exports = router