export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  authentication: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  },
});
