CREATE SCHEMA "line_me";
--> statement-breakpoint
CREATE TABLE "line_me"."audio_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"duration" integer NOT NULL,
	"content_provider_type" text NOT NULL,
	"original_content_url" text
);
--> statement-breakpoint
ALTER TABLE "line_me"."audio_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."emojis" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"index" integer NOT NULL,
	"length" integer NOT NULL,
	"product_id" text NOT NULL,
	"emoji_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."emojis" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webhook_event_id" text NOT NULL,
	"type" text,
	"reply_token" text,
	"timestamp" bigint NOT NULL,
	"source_type" text NOT NULL,
	"source_id" text,
	"user_id" text,
	"mode" text NOT NULL,
	"is_redelivery" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"destination" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."file_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."file_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."group_members" (
	"group_id" text NOT NULL,
	"user_id" text NOT NULL,
	"last_active" timestamp with time zone NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"first_seen" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "line_me"."group_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."groups" (
	"id" text PRIMARY KEY NOT NULL,
	"last_active" timestamp with time zone NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"first_seen" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."image_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"content_provider_type" text NOT NULL,
	"original_content_url" text,
	"preview_image_url" text,
	"image_set_id" text,
	"image_set_index" integer,
	"image_set_total" integer
);
--> statement-breakpoint
ALTER TABLE "line_me"."image_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."interaction_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."interaction_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."location_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"title" text,
	"address" text,
	"latitude" double precision,
	"longitude" double precision
);
--> statement-breakpoint
ALTER TABLE "line_me"."location_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."mentions" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"index" integer NOT NULL,
	"length" integer NOT NULL,
	"type" text NOT NULL,
	"user_id" text,
	"is_self" boolean
);
--> statement-breakpoint
ALTER TABLE "line_me"."mentions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."messages" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"type" text NOT NULL,
	"quote_token" text,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."sticker_keywords" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"keyword" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."sticker_keywords" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."sticker_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"package_id" text NOT NULL,
	"sticker_id" text NOT NULL,
	"sticker_resource_type" text NOT NULL,
	"text" text
);
--> statement-breakpoint
ALTER TABLE "line_me"."sticker_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."text_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"has_emojis" boolean DEFAULT false NOT NULL,
	"has_mentions" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."text_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"last_active" timestamp with time zone NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"first_seen" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "line_me"."video_messages" (
	"message_id" text PRIMARY KEY NOT NULL,
	"duration" integer NOT NULL,
	"content_provider_type" text NOT NULL,
	"original_content_url" text,
	"preview_image_url" text
);
--> statement-breakpoint
ALTER TABLE "line_me"."video_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."audio_messages" ADD CONSTRAINT "audio_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."emojis" ADD CONSTRAINT "emojis_message_id_text_messages_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."text_messages"("message_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."file_messages" ADD CONSTRAINT "file_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "line_me"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "line_me"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."image_messages" ADD CONSTRAINT "image_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."interaction_events" ADD CONSTRAINT "interaction_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "line_me"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."location_messages" ADD CONSTRAINT "location_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."mentions" ADD CONSTRAINT "mentions_message_id_text_messages_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."text_messages"("message_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."messages" ADD CONSTRAINT "messages_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "line_me"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."sticker_keywords" ADD CONSTRAINT "sticker_keywords_message_id_sticker_messages_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."sticker_messages"("message_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."sticker_messages" ADD CONSTRAINT "sticker_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."text_messages" ADD CONSTRAINT "text_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_me"."video_messages" ADD CONSTRAINT "video_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "line_me"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_events_source_id" ON "line_me"."events" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_events_created_at" ON "line_me"."events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_events_user_id" ON "line_me"."events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_interaction_events_event_id" ON "line_me"."interaction_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_interaction_events_created_at" ON "line_me"."interaction_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_messages_event_id" ON "line_me"."messages" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_messages_created_at" ON "line_me"."messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_messages_type" ON "line_me"."messages" USING btree ("type");