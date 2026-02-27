import { usersRelations, users } from "./user.model.js";
import { accounts } from "./account.model.js";
import { sessions, sessionsRelations } from "./session.model.js";
import { verifications } from "./verification.model.js";
import { files } from "./file.model.js";
import {
  reports,
  reportsRelations,
  reportsToKitoMembers,
  reportsToKitoMembersRelations
} from "./report.model.js";
import { evidences, evidencesRelations } from "./evidence.model.js";
import { kitoMembers, kitoMembersRelations } from "./kito-member.model.js";
import { meta } from "./meta.model.js";
import { locations, locationsRelations } from "./location.model.js";

export const Table = {
  meta,
  users,
  accounts,
  sessions,
  verifications,
  files,
  locations,
  reports,
  evidences,
  kitoMembers,
  reportsToKitoMembers
};

export const Relations = {
  usersRelations,
  sessionsRelations,
  locationsRelations,
  reportsRelations,
  evidencesRelations,
  kitoMembersRelations,
  reportsToKitoMembersRelations
};
