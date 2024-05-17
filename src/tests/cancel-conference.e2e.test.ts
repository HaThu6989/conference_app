import express from 'express'
import request from "supertest"
import { InMemoryConferenceRepository } from '../conference/adapters/in-memory-conference-repository'
import { InMemoryMailer } from '../core/adapters/in-memory-mailer'
import container from '../infrastructure/express/config/dependency-injection'
import { e2eBooking } from "./seeds/booking-seeds.e2e"
import { e2eConference } from "./seeds/conference-seeds.e2e"
import { e2eUsers } from "./seeds/user-seeds.e2e"
import { TestApp } from "./utils/test-app"

describe("Feature: Organize Conference",  () => {
  let testApp : TestApp
  let app: express.Application

  beforeEach(async() => {
    testApp = new TestApp()
    await testApp.setup()
  
    await testApp.loadFixture([
      e2eUsers.johnDoe,
      e2eUsers.bob,
      e2eConference.conference_poo,
      e2eConference.conference_poo2,
      e2eBooking.bobBooking
    ]) 
    app = testApp.getExpressApp()
  })

  afterAll(async()=>{
    await testApp.tearDown()
  })

  describe("Scenario: Cancel a conference successfully",() => {
    it("should cancel a conference and send confirmation emails", async () => {  
      const id = e2eConference.conference_poo.entity.props.id

      const response = await request(app)
                          .delete(`/conference/${id}`)
                          .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                          .send({
                            organizerId: e2eUsers.johnDoe.entity.props.id,
                            conferenceId: e2eConference.conference_poo.entity.props.id
                          })  

      expect(response.status).toBe(201);

      const conferenceRepository = container.resolve('conferenceRepository') as InMemoryConferenceRepository
      const deletedConference = await conferenceRepository.findById(id)
      expect(deletedConference!).toBe(null)

      const mailer = container.resolve('mailer') as InMemoryMailer;
      expect(mailer.sentEmails[0].to).toBe('bob@gmail.com');
    })
  })

})