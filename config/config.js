require('dotenv').config();

const DB_URI = process.env.DB_URI
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const CLIENT_URI = process.env.SERVER_URL
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

module.exports = {
    DB_URI,
    JWT_SECRET_KEY,
    CLIENT_URI,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
}

