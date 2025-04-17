import { 
    uuid, text, boolean, integer, 
    timestamp, vector, jsonb, pgSchema 
} from "drizzle-orm/pg-core"
import { relations } from 'drizzle-orm'

export const objectStorageSchema = pgSchema("object_storage")

export const objectStorage = objectStorageSchema.table('object_storage', {
    id: uuid('id').primaryKey().defaultRandom(),
    region: text('region'),
    bucketName: text('bucket_name').notNull(),
    key: text('key').notNull(),
    readable: boolean('readable').notNull().default(false),
    embedded: boolean('embedded').notNull().default(false),
    freezed: boolean('freezed').notNull().default(false),
    contentType: text('content_type').notNull(),
    sizeMB: integer('size_mb').notNull(),
    originalName: text('original_name'),
    providerId: uuid('provider'), // messaging provider id
    sourceId: text('provider_source_id'), // messaging provider source id
    sourceType: text('provider_source_type'), // messaging provider source type
    senderId: text('provider_sender_id'), // provider sender id
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true })
}).enableRLS()

export const objectChunks = objectStorageSchema.table('object_chunks', {
    id: uuid('id').primaryKey().defaultRandom(),
    objectStorageId: uuid('object_storage_id').notNull().references(() => objectStorage.id),
    chunk: text('chunk').notNull(),
    metadata: jsonb('metadata').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true })
}).enableRLS()

export const vectorStores = objectStorageSchema.table('vector_stores', {
    id: uuid('id').primaryKey().defaultRandom(),
    chunkId: uuid('chunk_id').notNull().references(() => objectChunks.id),
    embedding: vector('vector', { dimensions: 1536 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true })
}).enableRLS()

// --- RELATIONS ---
export const objectStorageRelations = relations(objectStorage, ({ many }) => ({
    objectChunks: many(objectChunks),
}))

export const objectChunksRelations = relations(objectChunks, ({ one }) => ({
    objectStorage: one(objectStorage, { fields: [objectChunks.objectStorageId], references: [objectStorage.id] })
}))

export const vectorStoresRelations = relations(vectorStores, ({ one }) => ({
    objectChunk: one(objectChunks, { fields: [vectorStores.chunkId], references: [objectChunks.id] })
}))