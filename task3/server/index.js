const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const {MONGO_URL, PORT} = process.env;
const cookieParser = require('cookie-parser')
const authRoute = require('./Routes/AuthRoute')

const app = express()

app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ['GET',"POST","PUT","DELETE","PATCH"],
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())
app.use('/', authRoute)

mongoose.connect(MONGO_URL)
.then(() => {
    console.log("mongoDB is connected sucessfully")
    app.listen(PORT, () => {
        console.log(`app listening on ${PORT}`)
    })
})
.catch((err) => console.log(err))







