import dotenv from 'dotenv'
import express from "express"
import mongoose from 'mongoose'
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware"
import { jsonResponseMiddleware } from "./middlewares/json-response.middleware"
import conferenceRoutes from "./routes/conference.routes"
dotenv.config()

if(!process.env.DATABASE_URL) throw new Error("Database url must be provided")

mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("Mongo connection established"))

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(jsonResponseMiddleware)
app.use(conferenceRoutes)

app.use(errorHandlerMiddleware)

export default app
