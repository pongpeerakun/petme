CREATE TABLE "assistric"."messaging_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assistric"."users_to_messaging_providers" (
	"user_id" text NOT NULL,
	"messaging_provider_id" uuid NOT NULL,
	CONSTRAINT "users_to_messaging_providers_user_id_messaging_provider_id_pk" PRIMARY KEY("user_id","messaging_provider_id")
);
--> statement-breakpoint
ALTER TABLE "assistric"."users_to_messaging_providers" ADD CONSTRAINT "users_to_messaging_providers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "assistric"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assistric"."users_to_messaging_providers" ADD CONSTRAINT "users_to_messaging_providers_messaging_provider_id_messaging_providers_id_fk" FOREIGN KEY ("messaging_provider_id") REFERENCES "assistric"."messaging_providers"("id") ON DELETE no action ON UPDATE no action;