// scripts/generate-swagger.ts
import swaggerAutogen from "swagger-autogen";
import { zodToJsonSchema } from "zod-to-json-schema";
import { signUpSchema } from "./src/modules/auth/schemas/sign-up.schema.js";
// Import other schemas as needed

const doc = {
  info: {
    title: "Q-Guard API",
    version: "1.0.0",
    description: "API documentation for Q-Guard application"
  },
  host: process.env.BASE_URL,
  basePath: "/api",
  schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter your bearer token in the format: Bearer <token>"
    }
  },
  definitions: {
    Error: {
      message: "string",
      code: "string"
    },
    User: {
      id: "string",
      email: "string",
      firstName: "string",
      lastName: "string",
      createdAt: "string"
    },
    SignUpRequest: zodToJsonSchema(signUpSchema, "SignUpRequest").definitions.SignUpRequest
  }
};

const outputFile = "./swagger-output.json";

// Point to your main app file or router entry point
const routes = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc).then(() => {
  console.log("Swagger documentation generated successfully");
});
