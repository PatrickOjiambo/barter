import { pgTable, PgTable, text } from "drizzle-orm/pg-core";
export const quickPlay = pgTable("quick_play", {
    username: text("username"),
    game: text("game").notNull(),
    solution: text("solution").notNull(),
    difficulty: text("difficulty").notNull(),
})