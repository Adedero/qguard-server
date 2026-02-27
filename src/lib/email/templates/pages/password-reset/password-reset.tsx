import * as React from "react";
import { Body, Container, Html, Link, Preview, Section, Text } from "@react-email/components";
import EmailFooter from "../../components/email-footer.js";
import EmailHead from "../../components/email-head.js";
import EmailTailwind from "../../components/email-tailwind.js";
import EmailHeader from "../../components/email-header.js";
import env from "#lib/env/index.js";

const appName = env.get("APP_NAME", "QGuard");
const baseURL = env.get("BASE_URL");
const headerImgURL = `${baseURL}/img/template-header-img-2.png`;
const title = "Reset Your Password";

export interface PasswordResetEmailProps {
  name: string;
  verificationURL: string;
  URLExpiryInHours: number;
}

export default function PasswordResetEmail({
  name,
  verificationURL,
  URLExpiryInHours
}: PasswordResetEmailProps) {
  return (
    <Html>
      <EmailHead />

      <Preview>{title}</Preview>

      <EmailTailwind>
        <Body className="bg-offWhite mx-auto my-auto px-2 py-4 font-sans">
          <Container className="bg-white mx-auto border border-[#E8E8E8] rounded-t-lg w-full max-w-[480px] overflow-hidden">
            {/* Header Section */}
            <EmailHeader title={title} backgroundImgURL={headerImgURL} />

            {/* Main Content */}
            <Section className="p-5 pb-8">
              <Text className="mb-4 text-gray-800 text-base leading-6">Hi {name},</Text>
              <Text className="mb-4 text-gray-800 text-base leading-6">
                To complete your request for a password reset, click the button below
              </Text>

              <Section className="mb-8">
                <Link
                  href={verificationURL}
                  className="bg-primary px-5 py-3 rounded-xl font-medium text-white text-sm cursor-pointer"
                >
                  Reset Password
                </Link>
              </Section>

              <Text className="mb-4 text-gray-800 text-base leading-6">
                If the button doesn't work, copy and paste this link into your browser:
                <br />
                <Link
                  href={verificationURL}
                  className="text-primary text-sm underline"
                  style={{ display: "inline-block" }}
                >
                  {verificationURL}
                </Link>
              </Text>

              <Text className="mb-4 text-gray-800 text-base leading-6">
                <b>NOTE: </b> This link expires in {URLExpiryInHours * 60} minutes.
              </Text>

              <Text className="mb-4 text-gray-800 text-base leading-6">
                If you did not request for a password reset, just ignore this email. Your account is
                safe and you have nothing to worry about!
              </Text>

              <Text className="m-0 text-gray-800 text-base leading-6">
                Stay Safe,
                <br />
                <strong>The {appName} Team</strong>
              </Text>
            </Section>

            {/* Footer */}
            <EmailFooter />
          </Container>
        </Body>
      </EmailTailwind>
    </Html>
  );
}
