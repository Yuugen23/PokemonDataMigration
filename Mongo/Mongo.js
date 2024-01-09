const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once("open", () => {
    console.log("db connected");
})

mongoose.connection.on("error", () => {
    console.log("db connection error");
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}