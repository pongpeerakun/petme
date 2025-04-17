CREATE SCHEMA "object_storage";
--> statement-breakpoint
CREATE TABLE "object_storage"."object_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"object_storage_id" uuid NOT NULL,
	"chunk" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "object_storage"."object_chunks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "object_storage"."object_storage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region" text,
	"bucket_name" text NOT NULL,
	"key" text NOT NULL,
	"readable" boolean DEFAULT false NOT NULL,
	"embedded" boolean DEFAULT false NOT NULL,
	"freezed" boolean DEFAULT false NOT NULL,
	"content_type" text NOT NULL,
	"size_mb" integer NOT NULL,
	"original_name" text,
	"provider" uuid,
	"provider_source_id" text,
	"provider_source_type" text,
	"provider_sender_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "object_storage"."object_storage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "object_storage"."vector_stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chunk_id" uuid NOT NULL,
	"vector" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "object_storage"."vector_stores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "object_storage"."object_chunks" ADD CONSTRAINT "object_chunks_object_storage_id_object_storage_id_fk" FOREIGN KEY ("object_storage_id") REFERENCES "object_storage"."object_storage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_storage"."vector_stores" ADD CONSTRAINT "vector_stores_chunk_id_object_chunks_id_fk" FOREIGN KEY ("chunk_id") REFERENCES "object_storage"."object_chunks"("id") ON DELETE no action ON UPDATE no action;