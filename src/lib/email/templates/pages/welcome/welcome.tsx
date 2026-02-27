import * as React from "react";
import { Body, Container, Html, Link, Preview, Section, Text } from "@react-email/components";
import EmailFooter from "../../components/email-footer.js";
import EmailHead from "../../components/email-head.js";
import EmailTailwind from "../../components/email-tailwind.js";
import EmailHeader from "../../components/email-header.js";
import env from "#lib/env/index.js";

const appName = env.get("APP_NAME", "QGuard");
const clientURL = `${env.get("CLIENT_URL", "")}/login`;

interface WelcomeEmailProps {
  name?: string;
}

const WelcomeEmail = ({ name = "Friend" }: WelcomeEmailProps) => {
  return (
    <Html>
      <EmailHead />

      <Preview>Welcome to {appName}: Your Safety Community</Preview>

      <EmailTailwind>
        <Body className="bg-offWhite my-auto mx-auto font-sans px-2 py-4">
          <Container className="bg-white border border-[#E8E8E8] rounded-t-lg mx-auto max-w-[480px] w-full overflow-hidden">
            {/* Header Section */}
            <EmailHeader title={`Welcome to ${appName}`} />

            {/* Main Content */}
            <Section className="p-5 pb-8">
              <Text className="text-base text-gray-800 leading-6 mb-4">Hi {name},</Text>
              <Text className="text-base text-gray-800 leading-6 mb-4">
                Welcome to {appName}. You are now part of a community dedicated to looking out for
                one another.
              </Text>
              <Text className="text-base text-gray-800 leading-6 mb-4">
                We built {appName} with a single mission: to help you make informed decisions about
                your safety without exposing your identity.
              </Text>
              <Text className="text-base text-gray-800 leading-6 mb-2 font-medium">
                How {appName} helps you stay safe:
              </Text>

              <ul className="ml-4 mb-6 list-disc text-gray-800">
                <li className="mb-3 text-base leading-6 pl-1">
                  <strong>🛡️ Run a Safety Lookup:</strong> Before meeting someone new, check your
                  meet-up location and their phone number against our community reported database to
                  see if the location has been flagged.
                </li>
                <li className="mb-3 text-base leading-6 pl-1">
                  <strong>📢 Report Incidents Anonymously:</strong> Help protect others by reporting
                  unsafe individuals or "kito" incidents. Your reports are vetted by trusted
                  members, not algorithms.
                </li>
                <li className="text-base leading-6 pl-1">
                  <strong>🔒 Privacy First:</strong> We never publish exact addresses, we do not
                  permanently store images, and we do not "out" anyone.
                </li>
              </ul>

              <Text className="text-base text-gray-800 leading-6 mb-8">
                Thank you for trusting us. Together, we are safer.
              </Text>

              <Section className="mb-8">
                <Link
                  href={clientURL}
                  className="bg-primary text-white font-medium text-sm px-5 py-3 rounded-xl cursor-pointer"
                >
                  Get Started
                </Link>
              </Section>

              <Text className="text-base text-gray-800 leading-6 m-0">
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
};

export default WelcomeEmail;
