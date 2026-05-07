import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1,
    workerThreads: true,
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
};

export default nextConfig;
