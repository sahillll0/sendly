/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Use your specific domain in production instead of "*"
          { key: "Access-Control-Allow-Methods", value: "GET, DELETE, PATCH, POST, PUT, OPTIONS" },
          // Notice we added 'apikey' and 'x-api-key' to the allowed headers list
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, apikey, x-api-key" },
        ]
      }
    ]
  }
};

export default nextConfig;
