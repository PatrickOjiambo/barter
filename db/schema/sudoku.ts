import { pgTable, text, serial, boolean, numeric, timestamp } from "drizzle-orm/pg-core"

export const challenge = pgTable("challenge", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
    entry_fee: numeric("entry_fee"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const challenge_member = pgTable("challenge_member", {
    username: text("username"),
    challenge_id: numeric("challenge_id"),
    score: numeric("score"),
})