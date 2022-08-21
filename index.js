const connectToMongo = require('./db')
const express = require('express')
const app = express()
var cors = require('cors')
const port = 5000

connectToMongo()

//In order to use request.body, the below middleware must be used
app.use(express.json())
//Explain below line
app.use(cors())

//Available routes
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`) 
})