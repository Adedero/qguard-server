import * as React from "react";
import { Column, Img, Link, Row, Section, Text } from "@react-email/components";
import env from "#lib/env/index.js";

const appName = env.get("APP_NAME", "Qguard");
const baseURL = env.get("BASE_URL", "");
const facebookURL = env.get("APP_FACEBOOK_URL", "");
const instagramURL = env.get("APP_INSTAGRAM_URL", "");
const xURL = env.get("APP_X_URL", "");

const year = new Date().getFullYear();

export default function EmailFooter() {
  return (
    <Section className="bg-[#E8E8E8] p-5">
      <Row>
        <Column align="left" style={{ verticalAlign: "middle" }}>
          <Text className="text-[#5C5C5C] text-xs font-medium m-0">
            © {year} {appName}. All rights reserved
          </Text>
        </Column>
        <Column align="right" style={{ verticalAlign: "middle" }}>
          <Link href={facebookURL} style={{ display: "inline-block", marginRight: "8px" }}>
            <Img src={`${baseURL}/img/facebook-logo.png`} width="18" height="18" alt="Facebook" />
          </Link>
          <Link href={xURL} style={{ display: "inline-block", marginRight: "8px" }}>
            <Img src={`${baseURL}/img/x-logo.png`} width="16" height="16" alt="X (Twitter)" />
          </Link>
          <Link href={instagramURL} style={{ display: "inline-block" }}>
            <Img src={`${baseURL}/img/instagram-logo.png`} width="18" height="18" alt="Instagram" />
          </Link>
        </Column>
      </Row>
    </Section>
  );
}
