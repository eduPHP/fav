import dotenv from 'dotenv'
dotenv.config()

export default {
    app: {
        port: process.env.SERVER_PORT
    },
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
}