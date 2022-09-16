export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    jwtKey: process.env.JWT_KEY,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
  },
});
