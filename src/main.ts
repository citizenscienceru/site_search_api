/*
    sequilise синхронизация бд
    NEST роутер

    массив с выбранными направлениями
    массив с локацией
    массив с участием
*/

// import express from "express";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { log_error } from "./logger.js";
import { connect } from "./db.js";

// const urlencode = require("urlencode");
// const json = require("json-middleware");
// const multipart = require("connect-multiparty");
// const multipartMiddleware = multipart();

// app.use(json);
// app.use(urlencode);

const indexRouter = async (req: Request, res: Response) => {
  console.log(req.body);
  return res.send("ok");
};

(async () => {
  const DB = await connect();
  if (DB.status !== "ok") {
    log_error(DB.toString());
    process.exit(1);
  }

  const app = express();
  // app.use(express.json());
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true,
    })
  );
  app.use("/", indexRouter);
  app.listen(3001);
})();
