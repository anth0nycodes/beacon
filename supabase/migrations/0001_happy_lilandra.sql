CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant');--> statement-breakpoint
ALTER TYPE "public"."file_type" ADD VALUE 'pptx';--> statement-breakpoint
CREATE TABLE "chat_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"revision_set_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "file_hash" TO "file_key";--> statement-breakpoint
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_revision_set_id_revision_sets_id_fk" FOREIGN KEY ("revision_set_id") REFERENCES "public"."revision_sets"("id") ON DELETE cascade ON UPDATE no action;