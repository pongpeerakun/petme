import { z } from "zod"

// Common structures
const Source = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user"),
    userId: z.string(),
  }),
  z.object({
    type: z.literal("group"),
    groupId: z.string(),
    userId: z.string().optional(),
  }),
  z.object({
    type: z.literal("room"),
    roomId: z.string(),
    userId: z.string().optional(),
  }),
])

const DeliveryContext = z.object({
  isRedelivery: z.boolean(),
})

// Content provider types
export const ContentProvider = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("line"),
  }),
  z.object({
    type: z.literal("external"),
    originalContentUrl: z.string(),
    previewImageUrl: z.string().optional(),
  }),
])

// Message types
export const TextMessage = z.object({
  id: z.string(),
  type: z.literal("text"),
  quoteToken: z.string().optional(),
  text: z.string(),
  emojis: z.array(z.object({
    index: z.number(),
    length: z.number(),
    productId: z.string(),
    emojiId: z.string(),
  })).optional(),
  mention: z.object({
    mentionees: z.array(z.discriminatedUnion("type", [
      z.object({
        index: z.number(),
        length: z.number(),
        type: z.literal("all"),
      }),
      z.object({
        index: z.number(),
        length: z.number(),
        userId: z.string(),
        type: z.literal("user"),
        isSelf: z.boolean().optional(),
      }),
    ])),
  }).optional(),
})

export const ImageMessage = z.object({
  id: z.string(),
  type: z.literal("image"),
  quoteToken: z.string().optional(),
  contentProvider: ContentProvider,
  imageSet: z.object({
    id: z.string(),
    index: z.number(),
    total: z.number(),
  }).optional(),
})

export const VideoMessage = z.object({
  id: z.string(),
  type: z.literal("video"),
  quoteToken: z.string().optional(),
  duration: z.number(),
  contentProvider: ContentProvider,
})

export const AudioMessage = z.object({
  id: z.string(),
  type: z.literal("audio"),
  duration: z.number(),
  contentProvider: ContentProvider,
})

export const FileMessage = z.object({
  id: z.string(),
  type: z.literal("file"),
  fileName: z.string(),
  fileSize: z.number(),
})

export const StickerMessage = z.object({
  id: z.string(),
  type: z.literal("sticker"),
  quoteToken: z.string().optional(),
  stickerId: z.string(),
  packageId: z.string(),
  stickerResourceType: z.enum(["MESSAGE", "ANIMATION"]),
  keywords: z.array(z.string()).optional(),
  text: z.string().optional(),
})

export const LocationMessage = z.object({
  id: z.string(),
  type: z.literal("location"),
  quoteToken: z.string().optional(),
  title: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const Message = z.discriminatedUnion("type", [
  TextMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  FileMessage,
  StickerMessage,
  LocationMessage,
])

// Event types
export const MessageEvent = z.object({
  type: z.literal("message"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  message: Message,
})

const FollowEvent = z.object({
  type: z.literal("follow"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  follow: z.object({
    isUnblocked: z.boolean(),
  }),
})

const UnfollowEvent = z.object({
  type: z.literal("unfollow"),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
})

const JoinEvent = z.object({
  type: z.literal("join"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
})

const LeaveEvent = z.object({
  type: z.literal("leave"),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
})

const MemberJoinedEvent = z.object({
  type: z.literal("memberJoined"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  joined: z.object({
    members: z.array(z.object({
      type: z.literal("user"),
      userId: z.string(),
    })),
  }),
})

const MemberLeftEvent = z.object({
  type: z.literal("memberLeft"),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  left: z.object({
    members: z.array(z.object({
      type: z.literal("user"),
      userId: z.string(),
    })),
  }),
})

const PostbackEvent = z.object({
  type: z.literal("postback"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  postback: z.object({
    data: z.string(),
    params: z.object({
      datetime: z.string().optional(),
      newRichMenuAliasId: z.string().optional(),
      status: z.string().optional(),
    }).optional(),
  }),
})

const VideoPlayCompleteEvent = z.object({
  type: z.literal("videoPlayComplete"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  videoPlayComplete: z.object({
    trackingId: z.string(),
  }),
})

const AccountLinkEvent = z.object({
  type: z.literal("accountLink"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  link: z.object({
    result: z.string(),
    nonce: z.string(),
  }),
})

const MembershipEvent = z.object({
  type: z.literal("membership"),
  replyToken: z.string(),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  membership: z.object({
    type: z.enum(["joined"]),
    membershipId: z.number(),
  }),
})

const UnsendEvent = z.object({
  type: z.literal("unsend"),
  mode: z.string(),
  timestamp: z.number(),
  source: Source,
  webhookEventId: z.string(),
  deliveryContext: DeliveryContext,
  unsend: z.object({
    messageId: z.string(),
  }),
})

// Combined Event type
export const Event = z.discriminatedUnion("type", [
  MessageEvent,
  FollowEvent,
  UnfollowEvent,
  JoinEvent,
  LeaveEvent,
  MemberJoinedEvent,
  MemberLeftEvent,
  PostbackEvent,
  VideoPlayCompleteEvent,
  AccountLinkEvent,
  MembershipEvent,
  UnsendEvent,
])

// Webhook payload
export const Payload = z.object({
  destination: z.string(),
  events: z.array(Event),
})
