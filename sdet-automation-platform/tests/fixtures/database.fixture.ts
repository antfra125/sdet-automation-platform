
import 'dotenv/config';
import { test as base } from '@playwright/test';
import pg from 'pg';

const { Pool } = pg;

type DatabaseFixtures = {
  db: pg.Pool;
};

export const test = base.extend<DatabaseFixtures>({
  db: async ({}, use) => {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    try {
      await use(pool);
    } finally {
      await pool.end();
    }
  }
});
