import { PrismaClient } from '@/src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? '' })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'samarchoughule44@gmail.com'
  
  try {
    await prisma.user.delete({ where: { email } })
    console.log(`\n✅ DELETED: ${email} - Now you can log in with Google cleanly!`)
  } catch (e: any) {
    console.log(`\nUser not found or already deleted. Go ahead and log in with Google!`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
