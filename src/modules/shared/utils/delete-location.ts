import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import { Meta } from "#database/utils/meta.js";
import logger from "#lib/logger/index.js";
import { deleteLocalAsset } from "#modules/assets/utils/delete-local-asset.js";
import { and, count, eq } from "drizzle-orm";

export const deleteLocation = async (locationId: string) => {
  try {
    const fileIds = await db.transaction(async (tx) => {
      // 1️⃣ Count pending reports
      const [pendingCount] = await tx
        .select({
          count: count()
        })
        .from(Table.reports)
        .where(
          and(eq(Table.reports.locationId, locationId), eq(Table.reports.pendingApproval, true))
        );

      // 2️⃣ Count approved reports
      const [approvedCount] = await tx
        .select({
          count: count()
        })
        .from(Table.reports)
        .where(
          and(eq(Table.reports.locationId, locationId), eq(Table.reports.pendingApproval, false))
        );

      // 3️⃣ Get only file IDs (small payload)
      const evidences = await tx
        .select({ fileId: Table.evidences.fileId })
        .from(Table.evidences)
        .where(eq(Table.evidences.locationId, locationId));

      const fileIds = evidences.map((e) => e.fileId);

      // 4️⃣ Delete location (cascades everything)
      await tx.delete(Table.locations).where(eq(Table.locations.id, locationId));

      // 5️⃣ Update metadata
      await Meta.update({
        db: tx,
        increment: {
          pendingReportsCount: -(pendingCount?.count ?? 0),
          approvedReportsCount: -(approvedCount?.count ?? 0)
        }
      });

      return fileIds;
    });

    // 6️⃣ Delete local files
    if (fileIds.length) {
      await deleteLocalAsset(fileIds, { db });
    }
    logger.info(`Deleted location with ID: ${locationId} and relevant files`);
  } catch (err) {
    logger.error("Failed to delete location", err);
  }
};
