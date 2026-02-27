import * as React from "react";
import { Heading, Img, Section } from "@react-email/components";
import env from "#lib/env/index.js";

const baseURL = env.get("BASE_URL");
const logoURL = `${baseURL}/logo.png`;

interface EmailHeaderProps {
  title: string;
  backgroundImgURL?: string;
}
export default function EmailHeader({ title, backgroundImgURL }: EmailHeaderProps) {
  backgroundImgURL = backgroundImgURL || `${baseURL}/img/template-header-img-1.png`;

  return (
    <Section className="bg-[#4B0082]/10 p-5 rounded-t-lg">
      <Img src={logoURL} width="36" height="36" alt="QGuard Logo" className="mb-4" />

      {/* Hero Image Container */}
      <Section className="bg-[#eee] mt-4 w-full overflow-hidden rounded">
        <Img
          src={backgroundImgURL}
          alt="Header Image"
          width="480"
          height="160"
          className="w-full object-cover"
        />
      </Section>

      <Heading className="font-header text-[30px] leading-tight text-black mt-6 mb-0">
        {title}
      </Heading>
    </Section>
  );
}
