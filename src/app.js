const fs = require("fs");
const Koa = require("koa");
const chalk = require("chalk");
const KoaBody = require("koa-body");
const views = require("koa-views");

const router = require("./route");

const app = new Koa();

app.use(
  KoaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024,
      uploadDir: "upload/",
      onFileBegin: (name, file) => {
        // 文件存储之前对文件进行重命名处理
        // const fileFormat = file.name.split(".");
        // file.name = `${Date.now()}.${fileFormat[fileFormat.length - 1]}`;
        if (!fs.existsSync("upload")) {
          fs.mkdirSync("upload");
        }
        file.path = `upload/${file.name}`;
      },
    },
  })
);

app.use(views(__dirname + "/views", { extension: "pug" }));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
  console.log(chalk.green("listening on ") + chalk.white.bgBlue("http://localhost:3001"));
});
