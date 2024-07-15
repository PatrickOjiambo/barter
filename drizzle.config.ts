import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

console.log("Connection String::", process.env.PG_CONNECTION_STRING)
const config = defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.PG_CONNECTION_STRING!,
    },
    verbose: true,
    strict: true,
    schema: './db/schema'
})

export default config