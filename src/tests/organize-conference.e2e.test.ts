import { addDays } from "date-fns"
import express from 'express'
import request from "supertest"
import { IConferenceRepository } from "../conference/ports/conference-repository.interface"
import container from "../infrastructure/express/config/dependency-injection"
import { e2eUsers } from "./seeds/user-seeds.e2e"
import { TestApp } from "./utils/test-app"

describe("Feature: Organize Conference",  () => {
  let testApp : TestApp
  let app: express.Application

  beforeEach(async() => {
    testApp = new TestApp()
    await testApp.setup()
  
    await testApp.loadFixture([e2eUsers.johnDoe]) 
    app = testApp.getExpressApp()
  })

  afterAll(async()=>{
    await testApp.tearDown()
  })

  describe("Scenario: User is authorized",() => {
    it("should organize a conference", async () => {    
      const startDate = addDays(new Date(),5)
      const endDate = addDays(new Date(),5)

      const response = await request(app)
                          .post("/conference")
                          .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                          .send({
                            title: "The pain of OOP",
                            seats: 100,
                            startDate: startDate.toISOString(),
                            endDate: endDate.toISOString()
                          })
      
      expect(response.status).toBe(201)
      expect(response.body.data).toEqual({id: expect.any(String)})

      // const conferenceRepository = container.resolve('conferenceRepository') as InMemoryConferenceRepository
      const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository
    
      // const createdConference = conferenceRepository.database[0]
      const createdConference = await conferenceRepository.findById(response.body.data.id)

       expect(createdConference).toBeDefined()
       expect(createdConference!.props).toEqual({
        id: response.body.data.id,
        organizerId: e2eUsers.johnDoe.entity.props.id,
        title: "The pain of OOP",
        seats: 100,
        startDate,
        endDate
    })
    })
  })

  describe("Scenario: User is not authorized",() => {
    it("should return 403", async () => {
      const response = await request(app)
                          .post("/conference")
                          .send({
                            title: "The pain of OOP",
                            seats: 100,
                            startDate: addDays(new Date(), 5).toISOString(),
                            endDate: addDays(new Date(), 5).toISOString()
                          })
      expect(response.status).toBe(403)
    })
  })
})