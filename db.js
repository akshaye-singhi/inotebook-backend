const mongoose = require('mongoose');
// 'mongodb+srv://<username>:<password>@cluster0.isxoemz.mongodb.net/<databaseName>'
const mongoURI = 'mongodb+srv://m001-student:m001-mongodb-basics@cluster0.isxoemz.mongodb.net/inotebook'

const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=> {
        console.log('Connected to Mongo successfully')
    })
}

module.exports = connectToMongo