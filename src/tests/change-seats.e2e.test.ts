import express from 'express'
import request from "supertest"
import { InMemoryConferenceRepository } from "../conference/adapters/in-memory-conference-repository"
import container from "../infrastructure/express/config/dependency-injection"
import { e2eBooking } from './seeds/booking-seeds.e2e'
import { e2eConference } from "./seeds/conference-seeds.e2e"
import { e2eUsers } from "./seeds/user-seeds.e2e"
import { TestApp } from "./utils/test-app"

describe("Feature: Change seats",  () => {
  let testApp : TestApp
  let app: express.Application

  beforeEach(async() => {
    testApp = new TestApp()
    await testApp.setup()

    await testApp.loadFixture([
      e2eUsers.johnDoe, 
      e2eUsers.bob, 
      e2eConference.conference_poo,
      e2eBooking.bobBooking
    ]) 
    app = testApp.getExpressApp()
  })

  afterAll(async()=>{
    await testApp.tearDown()
  })

  describe("Scenario: Happy path",() => {
    it("should change seats", async () => {
      const seats = 100
      const id = 'id-1'

      const response = await request(app)
                          .put(`/conference/${id}/seats`)
                          .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                          .send({seats})
                          
      expect(response.status).toBe(201)

      const conferenceRepository = container.resolve('conferenceRepository') as InMemoryConferenceRepository
      const updatedConference = await conferenceRepository.findById(id)

       expect(updatedConference).toBeDefined()
       expect(updatedConference!.props.seats).toEqual(seats)
    })
  })

  describe("Scenario: User is not authorized",() => {
    it("should return 403", async () => {
      const seats = 100
      const id = 'id-1'

      const response = await request(app)
                          .post(`/conference/${id}/seats`)
                          .send({seats})

      expect(response.status).toBe(403)
    })
  })
})