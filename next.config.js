/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/resume", destination: "/resume_byron_wall.pdf", permanent: false },
      { source: "/projects/plan-viewer", destination: "/projects/planboard", permanent: true },
    ];
  },
};

module.exports = nextConfig;
