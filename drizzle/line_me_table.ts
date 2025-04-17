import { 
    pgSchema, text, bigint, timestamp, 
    boolean, integer, jsonb, serial, primaryKey, 
    index, doublePrecision, uuid
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// Define the "line_me" schema
export const lineMeSchema = pgSchema("line_me");

// Events table
export const events = lineMeSchema.table('events', {
    id: uuid('id').primaryKey().defaultRandom(),
    webhookEventId: text('webhook_event_id').notNull(),
    type: text('type'),
    replyToken: text('reply_token'),
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(), // Unix timestamp
    sourceType: text('source_type').notNull(), // 'user', 'group', 'room'
    sourceId: text('source_id'), // userId, groupId, roomId
    userId: text('user_id'),
    mode: text('mode').notNull(), // 'active', 'standby'
    isRedelivery: boolean('is_redelivery').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    destination: text('destination').notNull(),
}, 
(table) => ({
    // index sourceId
    idxSourceId: index('idx_events_source_id').on(table.sourceId),
    // index createdAt
    idxCreatedAt: index('idx_events_created_at').on(table.createdAt),
    // index userId
    idxUserId: index('idx_events_user_id').on(table.userId),
})
).enableRLS()

// Messages table
export const messages = lineMeSchema.table('messages', {
    id: text('id').primaryKey(),
    eventId: uuid('event_id').notNull().references(() => events.id),
    type: text('type').notNull(), // 'text', 'image', 'video', etc.
    quoteToken: text('quote_token'),
    content: jsonb('content').notNull(), // Full message content
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
},
(table) => ({
    // index eventId
    idxEventId: index('idx_messages_event_id').on(table.eventId),
    // index createdAt
    idxCreatedAt: index('idx_messages_created_at').on(table.createdAt),
    // index type
    idxType: index('idx_messages_type').on(table.type),
})
).enableRLS()

// Text Messages table
export const textMessages = lineMeSchema.table('text_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    text: text('text').notNull(),
    hasEmojis: boolean('has_emojis').notNull().default(false),
    hasMentions: boolean('has_mentions').notNull().default(false),
}).enableRLS()

// Emojis table
export const emojis = lineMeSchema.table('emojis', {
    id: serial('id').primaryKey(),
    messageId: text('message_id').notNull().references(() => textMessages.messageId),
    index: integer('index').notNull(),
    length: integer('length').notNull(),
    productId: text('product_id').notNull(),
    emojiId: text('emoji_id').notNull(),
}).enableRLS()

// Mentions table
export const mentions = lineMeSchema.table('mentions', {
    id: serial('id').primaryKey(),
    messageId: text('message_id').notNull().references(() => textMessages.messageId),
    index: integer('index').notNull(),
    length: integer('length').notNull(),
    type: text('type').notNull(), // 'user', 'all'
    userId: text('user_id'), // Nullable if type is 'all'
    isSelf: boolean('is_self'),
}).enableRLS()

// Image Messages table
export const imageMessages = lineMeSchema.table('image_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    contentProviderType: text('content_provider_type').notNull(),
    originalContentUrl: text('original_content_url'),
    previewImageUrl: text('preview_image_url'),
    imageSetId: text('image_set_id'),
    imageSetIndex: integer('image_set_index'),
    imageSetTotal: integer('image_set_total'),
}).enableRLS()

// Video Messages table
export const videoMessages = lineMeSchema.table('video_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    duration: integer('duration').notNull(), // Milliseconds
    contentProviderType: text('content_provider_type').notNull(),
    originalContentUrl: text('original_content_url'),
    previewImageUrl: text('preview_image_url'),
}).enableRLS()

// Audio Messages table
export const audioMessages = lineMeSchema.table('audio_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    duration: integer('duration').notNull(), // Milliseconds
    contentProviderType: text('content_provider_type').notNull(),
    originalContentUrl: text('original_content_url'),
}).enableRLS()

// File Messages table
export const fileMessages = lineMeSchema.table('file_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    fileName: text('file_name').notNull(),
    fileSize: integer('file_size').notNull(), // Bytes
}).enableRLS()

export const locationMessages = lineMeSchema.table('location_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    title: text('title'),
    address: text('address'),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
}).enableRLS()

// Sticker Messages table
export const stickerMessages = lineMeSchema.table('sticker_messages', {
    messageId: text('message_id').primaryKey().references(() => messages.id),
    packageId: text('package_id').notNull(),
    stickerId: text('sticker_id').notNull(),
    stickerResourceType: text('sticker_resource_type').notNull(), // 'MESSAGE', 'ANIMATION', etc.
    text: text('text'), // Optional text with sticker
}).enableRLS()

// Sticker Keywords table
export const stickerKeywords = lineMeSchema.table('sticker_keywords', {
    id: serial('id').primaryKey(),
    messageId: text('message_id').notNull().references(() => stickerMessages.messageId),
    keyword: text('keyword').notNull(),
}).enableRLS()

// Users table
export const users = lineMeSchema.table('users', {
    id: text('id').primaryKey(),
    lastActive: timestamp('last_active', { withTimezone: true }).notNull(),
    messageCount: integer('message_count').notNull().default(0),
    firstSeen: timestamp('first_seen', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(), // Consider using .$onUpdate(() => new Date())
}).enableRLS()

// Groups table
export const groups = lineMeSchema.table('groups', {
    id: text('id').primaryKey(),
    lastActive: timestamp('last_active', { withTimezone: true }).notNull(),
    messageCount: integer('message_count').notNull().default(0),
    memberCount: integer('member_count').notNull().default(0),
    firstSeen: timestamp('first_seen', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(), // Consider using .$onUpdate(() => new Date())
}).enableRLS()

// Group Members table (Junction table)
export const groupMembers = lineMeSchema.table('group_members', {
    groupId: text('group_id').notNull().references(() => groups.id),
    userId: text('user_id').notNull().references(() => users.id),
    lastActive: timestamp('last_active', { withTimezone: true }).notNull(),
    messageCount: integer('message_count').notNull().default(0),
    firstSeen: timestamp('first_seen', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.userId] }),
})).enableRLS()

// interaction_events table
export const interactionEvents = lineMeSchema.table('interaction_events', {
    id: text('id').primaryKey(),
    eventId: uuid('event_id').notNull().references(() => events.id),
    content: jsonb('content').notNull(), // Full message content
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
},
(table) => ({
    // index eventId
    idxEventId: index('idx_interaction_events_event_id').on(table.eventId),
    // index createdAt
    idxCreatedAt: index('idx_interaction_events_created_at').on(table.createdAt),
})
).enableRLS()

// --- RELATIONS ---
// Define relations for easier querying (optional but recommended)

// Events relations
export const eventsRelations = relations(events, ({ one, many }) => ({
	messages: many(messages),
    user: one(users, { // Optional: Link event directly to user if userId is present
        fields: [events.userId],
        references: [users.id]
    }),
    // Potential relations to groups or users based on sourceType/sourceId if needed
}))

// Messages relations
export const messagesRelations = relations(messages, ({ one }) => ({
	event: one(events, {
		fields: [messages.eventId],
		references: [events.id],
	})
    // Add relations to specialized message types if needed for specific queries
    // e.g., textMessage: one(textMessages, { fields: [messages.id], references: [textMessages.messageId] })
}))

// Interaction Events relations
export const interactionEventsRelations = relations(interactionEvents, ({ one }) => ({
	event: one(events, {
		fields: [interactionEvents.eventId],
		references: [events.id],
	}),
}))

// Text Messages relations
export const textMessagesRelations = relations(textMessages, ({ one, many }) => ({
	message: one(messages, {
		fields: [textMessages.messageId],
		references: [messages.id],
	}),
	emojis: many(emojis),
	mentions: many(mentions),
}))

// Emojis relations
export const emojisRelations = relations(emojis, ({ one }) => ({
	textMessage: one(textMessages, {
		fields: [emojis.messageId],
		references: [textMessages.messageId],
	})
}))

// Mentions relations
export const mentionsRelations = relations(mentions, ({ one }) => ({
	textMessage: one(textMessages, {
		fields: [mentions.messageId],
		references: [textMessages.messageId],
	}),
    user: one(users, { // Link mention to the mentioned user if type is 'user'
        fields: [mentions.userId],
        references: [users.id]
    })
}))

// Sticker Messages relations
export const stickerMessagesRelations = relations(stickerMessages, ({ one, many }) => ({
	message: one(messages, {
		fields: [stickerMessages.messageId],
		references: [messages.id],
	}),
    keywords: many(stickerKeywords)
}))

// Sticker Keywords relations
export const stickerKeywordsRelations = relations(stickerKeywords, ({ one }) => ({
	stickerMessage: one(stickerMessages, {
		fields: [stickerKeywords.messageId],
		references: [stickerMessages.messageId],
	})
}))


// Users relations
export const usersRelations = relations(users, ({ many }) => ({
	groupMemberships: many(groupMembers),
    // Potentially add relations for messages sent by user, etc. if needed
    // events: many(events), // If tracking events initiated by user
}))

// Groups relations
export const groupsRelations = relations(groups, ({ many }) => ({
	members: many(groupMembers),
    // Potentially add relations for messages within the group if needed
}))

// Group Members relations (Junction table relations)
export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
	group: one(groups, {
		fields: [groupMembers.groupId],
		references: [groups.id],
	}),
	user: one(users, {
		fields: [groupMembers.userId],
		references: [users.id],
	}),
}))

export const errorEvents = lineMeSchema.table('error_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    content: jsonb('content').notNull(),
    error: text('error').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}).enableRLS()
