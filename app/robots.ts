import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/masuk", "/guru", "/orang-tua", "/owner"],
      },
    ],
    sitemap: "https://zielkidsclub.com/sitemap.xml",
  };
}
