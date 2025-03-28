import { config as conf } from "dotenv"
conf();

const _config = {
    port: process.env.PORT,
    dbUrl: process.env.MONGO_URI,
    env: process.env.NODE_ENV,
    secret: process.env.JWT_SECRET,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
}

export const config = Object.freeze(_config)