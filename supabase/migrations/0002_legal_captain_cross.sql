ALTER TABLE "line_me"."audio_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."emojis" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."file_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."group_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."image_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."mentions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."sticker_keywords" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."sticker_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."text_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."video_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "idx_events_source_id" ON "line_me"."events" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_events_created_at" ON "line_me"."events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_events_user_id" ON "line_me"."events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_messages_event_id" ON "line_me"."messages" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_messages_created_at" ON "line_me"."messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_messages_type" ON "line_me"."messages" USING btree ("type");