ALTER TABLE "document_summaries" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "document_summaries" DROP COLUMN "updated_at";--> statement-breakpoint
DROP TYPE "public"."status";