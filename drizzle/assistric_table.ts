import { user } from "../auth-schema.ts"
import { assistricSchema } from "./schema.ts"
import { relations } from 'drizzle-orm'
import { uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core"

export const messagingProviders = assistricSchema.table('messaging_providers', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const userRelations = relations(user, ({ many }) => ({
    usersToMessagingProviders: many(usersToMessagingProviders),
}))

export const messagingProviderRelations = relations(messagingProviders, ({ many }) => ({
    usersToMessagingProviders: many(usersToMessagingProviders),
}))

export const usersToMessagingProviders = assistricSchema.table('users_to_messaging_providers', {
    userId: text('user_id').notNull().references(() => user.id),
    messagingProviderId: uuid('messaging_provider_id').notNull().references(() => messagingProviders.id),
}, (t) => [
    primaryKey({ columns: [t.userId, t.messagingProviderId] })
])

export const usersToMessagingProvidersRelations = relations(usersToMessagingProviders, ({ one }) => ({
    user: one(user, {
        fields: [usersToMessagingProviders.userId],
        references: [user.id],
    }),
    messagingProvider: one(messagingProviders, {
        fields: [usersToMessagingProviders.messagingProviderId],
        references: [messagingProviders.id],
    })
}))
