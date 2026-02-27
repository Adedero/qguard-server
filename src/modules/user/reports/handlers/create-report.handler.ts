import db from "#database/index.js";
import { Table } from "#database/models/index.js";
import type { LocationModel } from "#database/schema.js";
import { HttpException } from "#errors/http-exception.js";
import { defineRequestHandler } from "#utils/request-handler.js";
import { eq, sql } from "drizzle-orm";
import { reportInputSchema } from "../schemas/report.schema.js";
import { Meta } from "#database/utils/meta.js";

export const createReport = defineRequestHandler({
  validator: { body: reportInputSchema },

  async handler(ctx) {
    const user = ctx.getAuthenticatedUser();
    const { body } = ctx.validated;

    const result = await db.transaction(async (tx) => {
      let location: LocationModel | undefined = undefined;

      if (body.locationId) {
        const existing = await tx.query.locations.findFirst({
          where: eq(Table.locations.id, body.locationId)
        });

        if (!existing) {
          throw HttpException.NOT_FOUND("Location not found");
        }

        location = existing;
      } else {
        location = (
          await tx
            .insert(Table.locations)
            .values({
              name: body.name,
              locationName: body.locationName,
              displayName: body.displayName,
              subregion: body.subregion,
              region: body.region,
              country: body.country,
              latitude: body.latitude,
              longitude: body.longitude
            })
            .returning()
        )[0];
      }

      if (!location) {
        throw HttpException.NOT_FOUND("Failed to create report");
      }

      const report = (
        await tx
          .insert(Table.reports)
          .values({
            locationId: location.id,
            reporterId: user.id,
            incidentDate: body.incidentDate,
            locationInfo: body.locationInfo,
            description: body.description,
            pendingApproval: true
          })
          .returning()
      )[0];

      if (!report) {
        throw HttpException.NOT_FOUND("Failed to create report");
      }

      // Can't update reportsCount since report is automatically pending when created
      // await tx
      //   .update(Table.locations)
      //   .set({
      //     reportsCount: sql`${Table.locations.reportsCount} + 1`
      //   })
      //   .where(eq(Table.locations.id, location.id));

      // let evidencesCount = 0;

      if (body.evidences?.length) {
        // evidencesCount = body.evidences.length;

        await tx.insert(Table.evidences).values(
          body.evidences.map((ev) => ({
            userId: user.id,
            reportId: report.id,
            locationId: location.id,
            fileId: ev.fileId,
            fileName: ev.fileName,
            fileType: ev.fileType,
            fileSize: ev.fileSize,
            fileURL: ev.fileURL
          }))
        );
      }

      let kitoMembersCount = 0;

      if (body.kitoMembers?.length) {
        const result = await tx
          .insert(Table.kitoMembers)
          .values(body.kitoMembers)
          .onConflictDoUpdate({
            target: Table.kitoMembers.id,
            set: {
              aliases: sql.raw(`excluded.${Table.kitoMembers.aliases.name}`),
              contacts: sql.raw(`excluded.${Table.kitoMembers.contacts.name}`)
            }
          })
          .returning({
            id: Table.kitoMembers.id,
            inserted: sql<boolean>`xmax = 0`
          });

        kitoMembersCount = result.filter((r) => r.inserted).length;

        if (result.length > 0) {
          await tx.insert(Table.reportsToKitoMembers).values(
            result.map((member) => ({
              reportId: report.id,
              kitoMemberId: member.id
            }))
          );
        }
      }

      await Meta.update({
        db: tx,
        increment: {
          locationsCount: body.locationId ? 0 : 1,
          pendingReportsCount: 1,
          kitoMembersCount
        }
      });

      return report;
    });

    ctx.res.status(201).json({
      success: true,
      status: 201,
      message: "Report created",
      data: { report: result }
    });
  }
});
