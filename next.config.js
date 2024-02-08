/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  // output: 'export',
  // distDir: 'build',
  basePath: '/amo-market',
  transpilePackages: [
    'rc-util',
    'rc-tree',
    'rc-pagination',
    'rc-picker',
    'rc-table',
    '@ant-design/icons',
    '@ant-design/icons-svg',
  ],
};

export default nextConfig;
