import { Sequelize, DataTypes } from "sequelize";
import config from "./config";

const sequelize = new Sequelize(
  `postgres://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`
);
//-------------------------------------------------------------------
type connectResult = {
  status: string; //"ok" | "error";
  data: string;
  sequelize?: Sequelize;
};
//-------------------------------------------------------------------
const Projects = sequelize.define(
  "projects",
  {
    name: {
      type: DataTypes.TEXT,
    },
    desc_short: {
      type: DataTypes.TEXT,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    small_image: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export { Projects };
//-------------------------------------------------------------------
// подключение к БД
export async function connect(): Promise<connectResult> {
  return await sequelize
    .authenticate()
    .then(() => {
      return {
        status: "ok",
        data: "Connection to DB has been established successfully.",
        sequelize: sequelize,
      };
    })
    .catch((error) => {
      return {
        status: "error",
        data: "PG: Unable to connect to the database: " + JSON.stringify(error),
      };
    });
}
//-------------------------------------------------------------------
