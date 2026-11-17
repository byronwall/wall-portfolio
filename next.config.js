/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [{ source: "/resume", destination: "/resume_byron_wall.pdf", permanent: false }];
  },
};

module.exports = nextConfig;
