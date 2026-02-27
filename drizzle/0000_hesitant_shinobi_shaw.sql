CREATE TYPE "public"."verification-type" AS ENUM('email_verification', 'password_reset');--> statement-breakpoint
CREATE TYPE "public"."asset-type" AS ENUM('image', 'video', 'audio', 'document', 'archive', 'other');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" jsonb,
	"role" text DEFAULT 'user' NOT NULL,
	"timeZone" text DEFAULT 'UTC' NOT NULL,
	"country" text NOT NULL,
	"region" text NOT NULL,
	"subregion" text NOT NULL,
	"phone" text,
	"lastLoginMethod" text,
	"banned" boolean DEFAULT false NOT NULL,
	"bannedReason" text,
	"banExpiresAt" timestamp,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"providerId" text NOT NULL,
	"password" text,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "accounts_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"type" "verification-type" NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "verifications_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"refreshToken" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"lastUsedAt" timestamp NOT NULL,
	"revokedAt" timestamp,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "sessions_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"path" text NOT NULL,
	"url" text NOT NULL,
	"type" "asset-type" NOT NULL,
	"mimeType" text NOT NULL,
	"ext" text NOT NULL,
	"size" integer NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "files_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"reporterId" text NOT NULL,
	"incidentDate" date NOT NULL,
	"locationName" text NOT NULL,
	"country" text NOT NULL,
	"region" text NOT NULL,
	"subregion" text NOT NULL,
	"address" text NOT NULL,
	"extraLocationInfo" text NOT NULL,
	"description" text NOT NULL,
	"latitude" real,
	"longitude" real,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports_to_kito_members" (
	"report_id" text NOT NULL,
	"kito_member_id" text NOT NULL,
	CONSTRAINT "reports_to_kito_members_report_id_kito_member_id_pk" PRIMARY KEY("report_id","kito_member_id")
);
--> statement-breakpoint
CREATE TABLE "evidences" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"reportId" text,
	"fileId" text NOT NULL,
	"fileName" text NOT NULL,
	"fileURL" text NOT NULL,
	"fileType" text NOT NULL,
	"fileSize" integer NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kito_members" (
	"id" text PRIMARY KEY NOT NULL,
	"fullName" text NOT NULL,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"contacts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"updatedAt" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports_to_kito_members" ADD CONSTRAINT "reports_to_kito_members_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports_to_kito_members" ADD CONSTRAINT "reports_to_kito_members_kito_member_id_kito_members_id_fk" FOREIGN KEY ("kito_member_id") REFERENCES "public"."kito_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_reportId_reports_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "accounts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_type_idx" ON "verifications" USING btree ("identifier","type");--> statement-breakpoint
CREATE INDEX "file_url_idx" ON "files" USING btree ("url");