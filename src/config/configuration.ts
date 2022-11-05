export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.APP_ENV || "dev",
    corsOrigin: process.env.CORS_FRONTEND_ORIGIN || "*"
  },
  auth: {
    jwtKey: process.env.JWT_KEY,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
  },
  cdn: {
    baseURL: process.env.CDN_BASEURL || "",
    s3Bucket: process.env.S3_BUCKET_NAME || ""
  },
});
