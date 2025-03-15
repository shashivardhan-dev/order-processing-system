import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongoDBURL: process.env.MONGODB_URL,
    accessTokenJwtSecret: process.env.ACCESS_TOKEN_JWT_SECRET,
    refreshTokenJwtSecret: process.env.REFRESH_TOKEN_JWT_SECRET,
    redisUrl: process.env.REDIS_URL,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sqsUrl: process.env.SQS_URL,
    sesSenderEmail: process.env.SES_SENDER_EMAIL,
    awsRegion: process.env.AWS_REGION,
    maxSqsRetries: process.env.MAX_SQS_RETRIES

}

export default config;