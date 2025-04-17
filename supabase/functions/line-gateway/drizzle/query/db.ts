import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { z } from "zod"
import {
    events,
    messages,
    textMessages,
    emojis,
    mentions,
    imageMessages,
    videoMessages,
    audioMessages,
    locationMessages,
    stickerMessages,
    fileMessages,
    stickerKeywords,
    interactionEvents,
    errorEvents,
} from "../table.ts"
import { Payload, Event, Message, TextMessage, ImageMessage, VideoMessage, AudioMessage, FileMessage, LocationMessage, StickerMessage, ContentProvider } from "./type.ts"

export class DbClient {
    constructor(private connStr: string) {
    }

    createClient() {
        const client = postgres(this.connStr, { prepare: false });
        const db = drizzle({ client })
        return db
    }

    async saveLineEvents(payload: z.infer<typeof Payload>) {
        const db = this.createClient()
        await db.transaction(async (tx) => {
            try {
                for (const event of payload.events) {
                    const newEvent = this.transformEvent(event, payload.destination)
                    const createdEvents = await tx.insert(events).values(newEvent).returning()

                    if (event.type !== "message") {
                        const newNonMessageEvent = this.transformNonMessageEvent(event, createdEvents[0].id)
                        await tx.insert(interactionEvents).values(newNonMessageEvent)
                    } else {
                        const message = this.transformMessage(event.message, createdEvents[0].id)
                        await tx.insert(messages).values(message)

                        const msgType = event.message.type
                        if (msgType === "text") {
                            const { text, emojiList, mentionList } = this.transformTextMessage(event.message)
                            await tx.insert(textMessages).values(text)
                            if (emojiList.length > 0)
                                await tx.insert(emojis).values(emojiList)
                            if (mentionList.length > 0)
                                await tx.insert(mentions).values(mentionList)
                        } else if (msgType === "image") {
                            const image = this.transformImageMessage(event.message)
                            await tx.insert(imageMessages).values(image)
                        } else if (msgType === "video") {
                            const video = this.transformVideoMessage(event.message)
                            await tx.insert(videoMessages).values(video)
                        } else if (msgType === "audio") {
                            const audio = this.transformAudioMessage(event.message)
                            await tx.insert(audioMessages).values(audio)
                        } else if (msgType === "file") {
                            const file = this.transformFileMessage(event.message)
                            await tx.insert(fileMessages).values(file)
                        } else if (msgType === "location") {
                            const location = this.transformLocationMessage(event.message)
                            await tx.insert(locationMessages).values(location)
                        } else if (msgType === "sticker") {
                            const { sticker, keywords } = this.transformStickerMessage(event.message)
                            await tx.insert(stickerMessages).values(sticker)
                            if (keywords.length > 0)
                                await tx.insert(stickerKeywords).values(keywords)
                        }
                    }
                }
            } catch (error) {
                console.error(error)
                await tx.insert(errorEvents).values({
                    content: payload,
                    error: error instanceof Error ? error.message : String(error),
                })
                tx.rollback()
            }
        })
    }

    private transformEvent(event: z.infer<typeof Event>, destination: string) {
        let sourceId = undefined
        let userId = undefined
        if (event.source.type === "user") {
            sourceId = event.source.userId
            userId = event.source.userId
        } else if (event.source.type === "group") {
            sourceId = event.source.groupId
        } else if (event.source.type === "room") {
            sourceId = event.source.roomId  
        }
        type IncommingEvent = typeof events.$inferInsert
        return {
            webhookEventId: event.webhookEventId,
            destination: destination,
            type: event.type,
            replyToken: 'replyToken' in event ? event.replyToken : undefined,
            timestamp: event.timestamp,
            sourceType: event.source.type,
            sourceId: sourceId,
            userId: userId,
            mode: event.mode,
            isRedelivery: event.deliveryContext.isRedelivery
        } as IncommingEvent
    }

    private transformNonMessageEvent(event: z.infer<typeof Event>, actualEventId: string) {
        type IncommingNonMessageEvent = typeof interactionEvents.$inferInsert
        return {
            id: event.webhookEventId,
            eventId: actualEventId,
            content: event,
        } as IncommingNonMessageEvent
    }

    private transformTextMessage(message: z.infer<typeof TextMessage>) {
        type IncommingTextMessage = typeof textMessages.$inferInsert
        type IncommingEmojis = typeof emojis.$inferInsert
        type IncommingMentions = typeof mentions.$inferInsert

        const emojiList: IncommingEmojis[] = message.emojis?.map((emoji) => ({
            messageId: message.id,
            index: emoji.index,
            length: emoji.length,
            productId: emoji.productId,
            emojiId: emoji.emojiId,
        })) ?? []

        const mentionList: IncommingMentions[] = message.mention?.mentionees.map((mention) => ({
            messageId: message.id,
            index: mention.index,
            length: mention.length,
            type: mention.type,
            userId: mention.type === "user" ? mention.userId : undefined,
            isSelf: mention.type === "all" ? undefined : mention.isSelf,
        } as IncommingMentions)) ?? []

        const text: IncommingTextMessage = {
            messageId: message.id,
            text: message.text,
            hasEmojis: message.emojis && message.emojis.length > 0,
            hasMentions: message.mention && message.mention.mentionees.length > 0,
        }

        return {
            text,
            emojiList,
            mentionList
        }
    }

    private transformMessage(message: z.infer<typeof Message>, actualEventId: string) {
        type IncommingMessage = typeof messages.$inferInsert
        return {
            id: message.id,
            eventId: actualEventId,
            type: message.type,
            content: message,
            quoteToken: 'quoteToken' in message ? message.quoteToken : undefined,
        } as IncommingMessage
    }

    private getContentProviderType(provider: z.infer<typeof ContentProvider>) {
        if (provider.type === "line") {
            return {
                type: "line",
                originalContentUrl: undefined,
                previewImageUrl: undefined,
            }
        } else if (provider.type === "external") {
            return {
                type: "external",
                originalContentUrl: provider.originalContentUrl,
                previewImageUrl: provider.previewImageUrl,
            }
        }
        throw new Error("Invalid content provider type")
    }

    private transformImageMessage(message: z.infer<typeof ImageMessage>) {
        type IncommingImageMessage = typeof imageMessages.$inferInsert
        const { type, originalContentUrl, previewImageUrl } = this.getContentProviderType(message.contentProvider)
        return {
            messageId: message.id,
            contentProviderType: type,
            originalContentUrl: originalContentUrl,
            previewImageUrl: previewImageUrl,
            imageSetId: message.imageSet?.id,
            imageSetIndex: message.imageSet?.index,
            imageSetTotal: message.imageSet?.total,
        } as IncommingImageMessage
    }

    private transformVideoMessage(message: z.infer<typeof VideoMessage>) {
        type IncommingVideoMessage = typeof videoMessages.$inferInsert
        const { type, originalContentUrl, previewImageUrl } = this.getContentProviderType(message.contentProvider)
        return {
            messageId: message.id,
            contentProviderType: type,
            originalContentUrl: originalContentUrl,
            previewImageUrl: previewImageUrl,
            duration: message.duration
        } as IncommingVideoMessage
    }

    private transformAudioMessage(message: z.infer<typeof AudioMessage>) {
        type IncommingAudioMessage = typeof audioMessages.$inferInsert
        const { type, originalContentUrl, previewImageUrl } = this.getContentProviderType(message.contentProvider)
        return {
            messageId: message.id,
            contentProviderType: type,
            originalContentUrl: originalContentUrl,
            previewImageUrl: previewImageUrl,
            duration: message.duration
        } as IncommingAudioMessage
    }

    private transformFileMessage(message: z.infer<typeof FileMessage>) {
        type IncommingFileMessage = typeof fileMessages.$inferInsert
        return {
            messageId: message.id,
            fileName: message.fileName,
            fileSize: message.fileSize,
        } as IncommingFileMessage
    }

    private transformLocationMessage(message: z.infer<typeof LocationMessage>) {
        type IncommingLocationMessage = typeof locationMessages.$inferInsert
        return {
            messageId: message.id,
            title: message.title,
            address: message.address,
            latitude: message.latitude,
            longitude: message.longitude,
        } as IncommingLocationMessage
    }

    private transformStickerMessage(message: z.infer<typeof StickerMessage>) {
        type IncommingStickerMessage = typeof stickerMessages.$inferInsert
        type IncommingStickerKeywords = typeof stickerKeywords.$inferInsert
        const sticker: IncommingStickerMessage = {
            messageId: message.id,
            stickerId: message.stickerId,
            packageId: message.packageId,
            stickerResourceType: message.stickerResourceType,
            text: message.text,
        }

        const keywords: IncommingStickerKeywords[] = message.keywords?.map((keyword) => ({
            messageId: message.id,
            keyword: keyword,
        })) ?? []

        return {
            sticker,
            keywords,
        }
    }
    
}