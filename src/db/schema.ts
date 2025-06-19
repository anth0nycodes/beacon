import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const fileTypeEnum = pgEnum("file_type", ["pdf", "docx", "txt", "pptx"]);
export const statusEnum = pgEnum("status", [
  "processing",
  "completed",
  "failed",
]);
export const planEnum = pgEnum("plan", ["free", "plus", "pro"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);

// all of the info inside users will be provided upon oauth login with supabase
export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revisionSets = pgTable("revision_sets", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  revisionSetId: uuid("revision_set_id")
    .notNull()
    .references(() => revisionSets.id, { onDelete: "cascade" }),
  originalFilename: text("original_filename").notNull(), // e.g., "notes.pdf" for the tab name in the UI
  fileType: fileTypeEnum("file_type").notNull(), // e.g., "pdf", "docx", "txt"
  fileKey: text("file_key").notNull(),
  ufsUrl: text("ufs_url").notNull(), // (UploadThing file URL which we can pass into langchain later for parsing)
  fileSize: integer("file_size").notNull(),
  content: text("content").notNull(), // (the raw content of the file after it has been parsed by langchain, could use this later for summarization. flashcards, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(), // (the timestamp when the file was processed by langchain)
});

export const documentSummaries = pgTable("document_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  revisionSetId: uuid("revision_set_id")
    .notNull()
    .references(() => revisionSets.id, { onDelete: "cascade" }),
  summaryText: text("summary_text").notNull(),
  status: statusEnum("status").notNull(), // (e.g., "pending", "completed", "failed")
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentFlashcards = pgTable("document_flashcards", {
  id: uuid("id").primaryKey().defaultRandom(),
  revisionSetId: uuid("revision_set_id")
    .notNull()
    .references(() => revisionSets.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: planEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatLogs = pgTable("chat_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  revisionSetId: uuid("revision_set_id")
    .notNull()
    .references(() => revisionSets.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
