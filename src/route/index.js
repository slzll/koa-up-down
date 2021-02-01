const fs = require("fs");
const path = require("path");
const send = require("koa-send");
const Router = require("koa-router");
const archiver = require("archiver");

const router = new Router();

router.get("/", async ctx => {
  await ctx.render("index.pug");
});

router.post("/upload", async (ctx, next) => {
  console.log("调用上传接口");
  // const file = ctx.request.files.file; // 获取上传文件
  // const reader = fs.createReadStream(file.path); // 创建可读流
  // const ext = file.name.split(".").pop(); // 获取上传文件扩展名
  // const upStream = fs.createWriteStream(`upload/${Math.random().toString()}.${ext}`); // 创建可写流
  // reader.pipe(upStream); // 可读流通过管道写入可写流
  // return (ctx.body = "上传成功");
  const file = ctx.request.files.file; // 获取上传文件
  ctx.body = {
    Type: 1,
    IsSuccess: true,
    Data: file.path,
    Message: "上传成功",
  }; // upload/xxx.xx
});

router.get("/download/:filename", async ctx => {
  const filename = ctx.params.filename;
  const path = `upload/${filename}`;
  ctx.attachment(path);
  await send(ctx, path);
});

router.get("/downloadAll", async ctx => {
  if (!fs.existsSync("ext")) {
    fs.mkdirSync("ext");
  }
  const zipName = `ext/${+new Date()}.zip`;
  const zipStream = fs.createWriteStream(zipName);
  const zip = archiver("zip");
  zip.pipe(zipStream);
  // 将upload中的每个文件打包
  // const dir = fs.readdirSync(path.resolve(__dirname, "../../upload"));
  // for (let i = 0; i < dir.length; i++) {
  //   zip.append(fs.createReadStream("upload/" + dir[i]), { name: dir[i] });
  // }
  // 将upload文件夹打包
  await zip.directory("upload");
  // 打包结束
  await zip.finalize();
  return send(ctx, zipName);
});

module.exports = router;
