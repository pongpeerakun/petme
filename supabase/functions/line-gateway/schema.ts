import { pgTable, bigserial, json } from "drizzle-orm/pg-core"

export const lineMessagesTable = pgTable("line_messages", {
  id: bigserial({ mode: "number" }).primaryKey(),
  content: json().notNull(),
})

