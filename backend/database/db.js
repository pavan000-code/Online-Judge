const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DBConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongo connected successfully");
    } catch (error) {
        console.log("Error while connecting to MongoDB", error.message);
    }
};

module.exports  = {DBConnection};

