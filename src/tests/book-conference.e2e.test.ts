import express from 'express'
import request from "supertest"
import { InMemoryBookingRepository } from '../conference/adapters/in-memory-booking-repository'
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

  describe("Scenario: Booking a conference successfully",() => {
    it("should book a conference and send confirmation emails", async () => {  
      const id = e2eConference.conference_poo2.entity.props.id

      const response = await request(app)
                          .post(`/conference/${id}/book`)
                          .set('Authorization', e2eUsers.bob.createAuthorizationToken())
                          .send({
                            userId: e2eUsers.bob.entity.props.id,
                            conferenceId: e2eConference.conference_poo2.entity.props.id
                          })      
      expect(response.status).toBe(201);
      expect(response.body.data.user.props.id).toEqual('bob');
      expect(response.body.data.conference.props.organizerId).toEqual('john-doe');

      const bookingRepository = container.resolve('bookingRepository') as InMemoryBookingRepository
      const createdBooking = (await bookingRepository.findByConferenceId(id)).find(booking => booking.props.userId === 'bob')
  
      expect(createdBooking).toBeDefined()

      const mailer = container.resolve('mailer') as InMemoryMailer;
      expect(mailer.sentEmails[0].to).toBe('bob@gmail.com');     
    })
  })
})