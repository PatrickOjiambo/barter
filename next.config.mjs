/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: "dw26fem5oa72i.cloudfront.net",
        },
        {
          hostname: "api.dicebear.com",
        },
        {
          hostname: "images.unsplash.com",
        },
        {
          hostname: "www.writeups.org",
        },
        {
          hostname: "*",
        },
      ],
    },
    crossOrigin: "anonymous",
  };
  
  export default nextConfig;