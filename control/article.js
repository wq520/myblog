const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')
// 取用户 schema ，为了拿到 users 操作的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users", UserSchema)

// 通过 db 对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema)

// 返回文章发表页
exports.addPage = async (ctx) => {
    await ctx.render("add-article", {
        title: "文章发表页",
        session: ctx.session
    })
}
// 文章的发表（保存到数据库）
exports.add = async ctx => {
    if (ctx.session.isNew) {
        // true 就没有登录 就不需要查询数据库
        return ctx.body = {
            msg: "用户未登录",
            status: 0
        }
    }

    // 用户登录情况
    // 用户登录 post 请求发送过来的数据
    const data = ctx.request.body
    // 添加文章作者
    data.author = ctx.session.uid
    await new Promise((resolve, reject) => {
       new Article(data).save((err, data) => {
           if (err) return reject(err)
           resolve(data)
       })
   })
   .then(data => {
       ctx.body = {
           msg: "发表成功",
           status: 1
       }
   })
   .catch(err => {
       ctx.body = {
           msg: "发表失败",
           status: 0
       }
   })
}

//获取文章列表
exports.getList = async ctx => {
    // 查询每篇文章对应作者的头像
    let page = ctx.params.id || 1
    page--

    const maxNum = await estimatedDocumentCount((err, num) => err ? console.log(err) : num)
    const artList = await Article
    .find()
    .sort('-created')
    .skip(5 * page)
    .limit(5)
    .populate({ //用于联表查询
        path: "author",
        select: '_id username avatar'
    })
    .then(data => data)
    .catch(err => console.log(err))

    console.log(artList)

    await ctx.render("index", {
        session: ctx.session,
        title: "寒光博客",
        artList,
        maxNum
    })
}

// 文章详情
exports.details = async ctx => {
    // 去动态路由里面的 id
    const _id =  ctx.params.id
   
    const article = await Article
    .findById(_id)
    .populate("author", "username")
    .then(data => data)

    await ctx.render("article", {
        title: article.title,
        article,
        session: ctx.session
    })
}