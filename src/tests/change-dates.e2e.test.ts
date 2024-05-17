import { addDays } from 'date-fns'
import express from 'express'
import request from "supertest"
import { InMemoryConferenceRepository } from '../conference/adapters/in-memory-conference-repository'
import container from '../infrastructure/express/config/dependency-injection'
import { e2eBooking } from './seeds/booking-seeds.e2e'
import { e2eConference } from "./seeds/conference-seeds.e2e"
import { e2eUsers } from "./seeds/user-seeds.e2e"
import { TestApp } from "./utils/test-app"

describe("Feature: Change dates",  () => {
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
    it("should change dates", async () => {
      const id = e2eConference.conference_poo.entity.props.id
      const startDate = addDays(new Date(), 10)
      const endDate = addDays(new Date(), 10)

      const response = await request(app)
                          .put(`/conference/${id}/dates`)
                          .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                          .send({startDate, endDate})

      expect(response.status).toBe(201)

      const conferenceRepository = container.resolve('conferenceRepository') as InMemoryConferenceRepository
      const updatedConference = await conferenceRepository.findById(id)

      expect(updatedConference).toBeDefined()

      expect(updatedConference!.props.startDate).toEqual(startDate)
      expect(updatedConference!.props.endDate).toEqual(endDate)
    })
  })

  describe("Scenario: User is not authorized",() => {
    it("should return 403", async () => {
      const id = e2eConference.conference_poo.entity.props.id
      const startDate = addDays(new Date(), 10)
      const endDate = addDays(new Date(), 10)

      const response = await request(app)
                          .post(`/conference/${id}/dates`)
                          .send({startDate, endDate})

      expect(response.status).toBe(403)
    })
  })
})