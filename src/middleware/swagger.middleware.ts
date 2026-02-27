import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swagger-output.json" with { type: "json" };

export default function swaggerUI(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
