
const mongoose = require("mongoose");

let client;

async function connect() {
    if (!client) {
        try {
            client = await mongoose.connect( 'mongodb://127.0.0.1:27017/moviesSeriesManagement',
                {   
                    serverSelectionTimeoutMS: 5000,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    // keepAlive: true
                }
            )
            console.log("connected successfully")
        } catch (error) {
            console.log(error)
        }
    }
    return client;
}

module.exports = {
    connect
}