import { Sequelize, DataTypes, Op } from "sequelize";
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

type searchResult = {
  data: string;
};

type whereCondition = {
  name?: string;
  trends?: unknown;
  location?: unknown;
  participation?: unknown;
};
//-------------------------------------------------------------------
const Projects = sequelize.define(
  "projects",
  {
    title: {
      type: DataTypes.TEXT,
    },
    tags: {
      type: DataTypes.JSONB,
    },
    description_short: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    small_logo: {
      type: DataTypes.TEXT,
    },
    logo: {
      type: DataTypes.TEXT,
    },
    trends: {
      type: DataTypes.JSONB,
    },
    location: {
      type: DataTypes.JSONB,
    },
    participation: {
      type: DataTypes.JSONB,
    },
    url: {
      type: DataTypes.TEXT,
    },
    path: {
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

// поиск проектов
export async function findProjects(data: string): Promise<searchResult> {
  let where: whereCondition = {};
  try {
    const searchData = JSON.parse(data);
    // первый поиск - по названию
    if (searchData.name) {
      where = { name: searchData.name };
    } else {
      // поиск по остальным параметрам
      if (searchData.trend && searchData.trend[0]) {
        where = {
          trends: {
            [Op.contains]: searchData.trend, //JSON.parse(searchData.trend),
          },
        };
      }
      if (searchData.location && searchData.location[0]) {
        where.location = {
          [Op.contains]: JSON.parse(searchData.location),
        };
      }
      if (searchData.participation && searchData.participation[0]) {
        where.participation = {
          [Op.contains]: JSON.parse(searchData.participation),
        };
      }
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const result = await Projects.findAll({
      where: where,
    });
    return { data: JSON.stringify(result) };
  } catch (error) {
    return { data: JSON.stringify(error) };
  }
}
//-------------------------------------------------------------------
