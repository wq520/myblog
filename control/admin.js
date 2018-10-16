const { db } = require("../Schema/config");
const ArticleSchema = require("../Schema/article");
// 取用户 schema ，为了拿到 users 操作的实例对象
const UserSchema = require("../Schema/user");
const User = db.model("users", UserSchema);

// 通过 db 对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema);

const CommentSchema = require("../Schema/comment");
const Comment = db.model("comments", CommentSchema);

const fs = require("fs");
const { join } = require("path");

exports.index = async ctx => {
    if (ctx.session.isNew) {
        // 没有登录
        ctx.status = "404"
        return await ctx.render("404", {
            title: "404"
        })
    }

    const id = ctx.params.id
    const arr = fs.readdirSync(join(__dirname, "../views/admin"));

    let flag = false

    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "");
        if (name === id) {
            flag = true
        }
    })

    if (flag) {
        await ctx.render("./admin/admin-" + id, {
            role: ctx.session.role
        })
    } else {
        ctx.status = "404"
        await ctx.render("404", {
            title: "404"
        })
    }
}