export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongoDb: process.env.MONGO_CONNECTION,
  port: Number(process.env.PORT ?? process.env.LOCAL_PORT ?? 4000),
  defaultLimit: Number(process.env.DEFAULT_LIMIT ?? 7),
});
