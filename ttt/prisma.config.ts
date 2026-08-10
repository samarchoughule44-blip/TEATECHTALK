import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local first (Next.js), then .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use DIRECT_URL for CLI operations (db push, migrations)
    // This bypasses pgbouncer which doesn't support DDL statements
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
