import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { UserModel } from "../src/infrastructure/database/mysql/models/user.model";

// Load environment variables from .env file
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "nestjs_clean_arch",
  entities: [UserModel],
  migrations: ["dist/db/migrations/*.js"],
  synchronize: false, // Set to false for production to use migrations
  logging: process.env.NODE_ENV !== "production",
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
