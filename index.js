import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/authRoute.js'
import connectDB from './config/db.js'
dotenv.config()


const app = express();

app.use(express.json())


// route

app.use('/api/v1/auth', authRoute)

// database
connectDB();

// server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`server is runnibg at port ${PORT}`)
})