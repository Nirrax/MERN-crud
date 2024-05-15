require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const tokenVerification = require('./Middleware/tokenVerification')

//middleware
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
//dbConnect
const connection = require('./db')
connection()
//routes
const userRoutes = require("./Routes/Users")
const authRoutes = require("./Routes/Auth")
//…
// routes
app.get("/api/users/",tokenVerification)
app.get("/api/users/details",tokenVerification)
app.delete("/api/users/",tokenVerification)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)