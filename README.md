# 个人学术网站（中英双语）

零成本、零依赖的静态网站，托管在 GitHub Pages 上。

## 部署到 GitHub Pages（只需一次）

1. 注册 / 登录 [GitHub](https://github.com)。
2. 新建一个仓库，名字必须是：`你的用户名.github.io`（Public）。
3. 在本文件夹中执行：

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

4. 等 1–2 分钟，打开 `https://你的用户名.github.io` 即可看到网站。

## 日常更新

| 要做什么 | 改哪里 |
|---|---|
| 改名字、简介、联系方式 | `index.html` |
| 加 / 改论文 | `publications.html`（首页的"代表论文"在 `index.html`） |
| 改简历 | `cv.html` |
| 写博客 | 在 `posts/` 新建 `.md` 文件，并在 `posts/posts.json` 里登记 |
| 改配色 / 字体 | `assets/css/style.css` 顶部的 `:root` 变量 |

改完后：

```bash
git add .
git commit -m "update"
git push
```

## 博客文章的双语写法

每个 `.md` 文件里，中文写在前半部分，然后用 `<!--lang:en-->` 隔开，英文写在后半部分。网站右上角的中 / EN 按钮会切换显示。

## 绑定自己的域名（可选）

在仓库 Settings → Pages → Custom domain 填入你买的域名，并在域名服务商处添加 CNAME 记录指向 `你的用户名.github.io`。
