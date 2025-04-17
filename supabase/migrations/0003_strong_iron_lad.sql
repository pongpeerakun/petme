CREATE TABLE "line_me"."interaction_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"quote_token" text,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "line_me"."interaction_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "line_me"."interaction_events" ADD CONSTRAINT "interaction_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "line_me"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_interaction_events_event_id" ON "line_me"."interaction_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_interaction_events_created_at" ON "line_me"."interaction_events" USING btree ("created_at");