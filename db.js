const mongoose = require('mongoose');
const mongoURI'mongodb+srv://<username>:<password>@cluster0.isxoemz.mongodb.net/<databaseName>'

const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=> {
        console.log('Connected to Mongo successfully')
    })
}

module.exports = connectToMongo