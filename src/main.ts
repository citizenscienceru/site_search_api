/*
    sequilise синхронизация бд
    NEST роутер
*/

// import express from "express";
import express, { Request, Response } from "express";
import { log_error } from "./logger.js";
import { connect } from "./db.js";

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
  app.use(express.json());
  app.use("/", indexRouter);
  app.listen(3001);
})();
