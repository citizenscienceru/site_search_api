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
    trends: {
      type: DataTypes.JSONB,
    },
    location: {
      type: DataTypes.JSONB,
    },
    participation: {
      type: DataTypes.JSONB,
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
  const searchData = JSON.parse(data);
  // первый поиск - по названию
  let where: whereCondition = {};
  if (searchData.name) {
    where = { name: searchData.name };
  } else {
    // поиск по остальным параметрам
    if (searchData.trend) {
      where = {
        trends: {
          [Op.contains]: JSON.parse(searchData.trend),
        },
      };
    }
    if (searchData.location) {
      where.location = {
        [Op.contains]: JSON.parse(searchData.location),
      };
    }
    if (searchData.participation) {
      where.participation = {
        [Op.contains]: JSON.parse(searchData.participation),
      };
    }
  }

  try {
    const result = await Projects.findAll({
      where: where,
    });
    // console.log("Result:", result);
    return { data: JSON.stringify(result) };
  } catch (error) {
    return { data: JSON.stringify(error) };
  }
}
//-------------------------------------------------------------------
