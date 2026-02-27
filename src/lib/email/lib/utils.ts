import { createTransport as createNodemailerTransport } from "nodemailer";
import { transports, type TransportName } from "./config.js";
import type { SendMailOptions } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

interface CreateTransportOptions {
  host: string;
  port: number;
  email: string;
  password: string;
  secure?: boolean;
}
export function createTransport(options: CreateTransportOptions) {
  if (!options) {
    throw new Error("Create transport options is required");
  }
  return createNodemailerTransport({
    host: options.host,
    port: options.port,
    secure: options.secure,
    auth: {
      user: options.email,
      pass: options.password
    }
  });
}

export async function sendMail(name: TransportName, options: Omit<SendMailOptions, "from">) {
  const transport = transports[name];
  if (!transport) {
    throw new Error("Transport with name " + name + " not found");
  }

  return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    transport.transport.sendMail(
      {
        ...options,
        from: {
          name: transport.name,
          address: transport.email
        }
      },
      (err, info) => {
        if (err) {
          return reject(err);
        }
        resolve(info);
      }
    );
  });
}
