CREATE SCHEMA "assistric";
--> statement-breakpoint
CREATE TABLE "assistric"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assistric"."account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assistric"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "assistric"."session" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assistric"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"username" text,
	"display_username" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "assistric"."user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assistric"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "assistric"."verification" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "assistric"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "assistric"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assistric"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "assistric"."user"("id") ON DELETE cascade ON UPDATE no action;