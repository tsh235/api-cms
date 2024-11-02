import 'dotenv/config';
import { default as Knex } from 'knex';

export const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
		ssl: process.env.DB_SSL,
  },
});
