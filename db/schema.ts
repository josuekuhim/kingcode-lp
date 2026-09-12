import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("landing"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  confirmationSentAt: text("confirmation_sent_at"),
  confirmationMessageId: text("confirmation_message_id"),
});
