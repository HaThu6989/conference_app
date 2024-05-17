import { AwilixContainer } from "awilix"
import express from "express"
import mongoose from "mongoose"
import container from "../../infrastructure/express/config/dependency-injection"
import { errorHandlerMiddleware } from "../../infrastructure/express/middlewares/error-handler.middleware"
import { jsonResponseMiddleware } from "../../infrastructure/express/middlewares/json-response.middleware"
import conferenceRoutes from "../../infrastructure/express/routes/conference.routes"
import { IFixture } from "./fixture"

export class TestApp {
  private app: express.Application
  private container: AwilixContainer

  constructor(){
    this.app = express()
    this.container = container
  }

  async setup(){
    await mongoose.connect('mongodb://admin:qwerty@localhost:3702/conferences?authSource=admin')
    await mongoose.connection.db.collection('users').deleteMany({})
    await mongoose.connection.db.collection('conferences').deleteMany({})
    
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(jsonResponseMiddleware)
    this.app.use(conferenceRoutes)
    this.app.use(errorHandlerMiddleware)
  }

  async tearDown(){
    await mongoose.connection.close()
  }
  
  async loadFixture(fixtures : IFixture[]) {
    await Promise.all(fixtures.map(fixture => fixture.load(this.container)))
  }

  getExpressApp(){
    return this.app
  }
}