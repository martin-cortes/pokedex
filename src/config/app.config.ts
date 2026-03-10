export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongoDb: process.env.MONGO_CONNECTION,
    port: process.env.PORT ?? 3001,
    defaultLimit: parseInt(process.env.DEFAULT_LIMIT!) ?? 7
})