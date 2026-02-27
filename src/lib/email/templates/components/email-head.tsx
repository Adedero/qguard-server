import * as React from "react";
import { Head, Font } from "@react-email/components";

export default function EmailHead() {
  return (
    <Head>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
          format: "woff2"
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Rethink Sans"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: "https://fonts.gstatic.com/s/rethinksans/v1/MJVBnM4vpXP6h2vC-mKz8zSwl01Q.woff2",
          format: "woff2"
        }}
        fontWeight={700}
        fontStyle="normal"
      />
    </Head>
  );
}
