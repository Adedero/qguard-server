import * as React from "react";
import { Tailwind } from "@react-email/components";

export default function EmailTailwind({ children }: React.PropsWithChildren<{}>) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#4B0082",
              offWhite: "#F5F5F5"
            },
            fontFamily: {
              sans: ["Inter", "sans-serif"],
              header: ["Rethink Sans", "sans-serif"]
            }
          }
        }
      }}
    >
      {children}
    </Tailwind>
  );
}
