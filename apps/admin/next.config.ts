import type { NextConfig } from "next";
import { securityHeaders } from "../../security-headers.mjs";

const nextConfig: NextConfig = {
  transpilePackages: ["@irate/ui", "@irate/api-client", "@irate/contracts", "@irate/bff"],
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
