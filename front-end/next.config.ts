// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // No basePath
//   // No assetPrefix
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/microcapsulas",
  assetPrefix: "/microcapsulas",
  output: "standalone", // importante para producción en contenedor
};

export default nextConfig;
