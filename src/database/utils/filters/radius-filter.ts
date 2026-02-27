import { sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

interface RadiusFilterOptions {
  lat: number;
  lng: number;
  radiusKm: number;
  latColumn: PgColumn;
  lngColumn: PgColumn;
}

export function radiusFilter({ lat, lng, radiusKm, latColumn, lngColumn }: RadiusFilterOptions) {
  return sql`(
    6371 * acos(
      LEAST(1, GREATEST(-1,
        cos(radians(${lat})) *
        cos(radians(${latColumn})) *
        cos(radians(${lngColumn}) - radians(${lng})) +
        sin(radians(${lat})) *
        sin(radians(${latColumn}))
      ))
    )
  ) <= ${radiusKm}`;
}
