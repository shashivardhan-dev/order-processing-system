import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongoDBURL: process.env.MONGO_DB_URL,
    jwtSecret: process.env.JWT_SECRET,
}

export default config;