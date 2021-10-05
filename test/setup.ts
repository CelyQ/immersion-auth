import * as dotenv from 'dotenv'
import { Pool, PoolConfig } from 'pg'

dotenv.config({ path: '.env.test' })

const config: PoolConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.EXPOSED_POSTGRES_PORT),
  host: process.env.EXPOSED_POSTGRES_HOSTNAME,
  database: process.env.POSTGRES_DB,
}

global.beforeEach(async () => {
  const pool = new Pool(config)

  pool.query('TRUNCATE TABLE "user"', (err) => {
    if (err) return
    pool.end()
  })
})
