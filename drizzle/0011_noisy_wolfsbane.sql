DROP INDEX "reports_created_at_id_idx";--> statement-breakpoint
CREATE INDEX "reports_id_desc_idx" ON "reports" USING btree ("createdAt","id" desc);--> statement-breakpoint
CREATE INDEX "pending_approval_idx" ON "reports" USING btree ("pendingApproval");