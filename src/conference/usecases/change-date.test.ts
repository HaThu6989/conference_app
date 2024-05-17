import { FixedDateGenerator } from "../../core/adapters/fixed-date-generator"
import { InMemoryMailer } from "../../core/adapters/in-memory-mailer"
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository"
import { testUsers } from "../../user/tests/user-seeds"
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Booking } from "../entities/booking.entities"
import { testConference } from "../tests/conference-seeds"
import { ChangeDates } from "./change-date"

describe("Feature: Change dates", () => {
  async function expectSeatsToRemainUnchanged () {
    const updatedConference = await conferenceRepository.findById(testConference.conference1.props.id)
      expect (updatedConference!.props.startDate).toEqual(testConference.conference1.props.startDate)
      expect (updatedConference!.props.endDate).toEqual(testConference.conference1.props.endDate)
  }

  const bobBooking = new Booking( {
    userId: testUsers.bob.props.id,
    conferenceId: testConference.conference1.props.id
  })

  let usecase: ChangeDates
  let conferenceRepository: InMemoryConferenceRepository
  let dateGenerator: FixedDateGenerator
  let bookingRepository: InMemoryBookingRepository
  let mailer: InMemoryMailer
  let userRepository: InMemoryUserRepository

  beforeEach(async()=> {
    conferenceRepository = new InMemoryConferenceRepository()
    await conferenceRepository.create(testConference.conference1)

    bookingRepository = new InMemoryBookingRepository()
    await bookingRepository.create(bobBooking)

    userRepository = new InMemoryUserRepository()
    await userRepository.create(testUsers.alice )
    await userRepository.create(testUsers.bob )

    dateGenerator = new FixedDateGenerator()

    mailer = new InMemoryMailer()

    usecase = new ChangeDates(conferenceRepository, dateGenerator, bookingRepository, mailer, userRepository)
    
  })

  describe('Scenario: Happy path',() => {
    const payload = {
      user: testUsers.alice,
      conferenceId: testConference.conference1.props.id,
      startDate: new Date('2024-05-22T10:00:00.000Z'),
      endDate: new Date('2024-05-22T13:00:00.000Z'),
    }

    it("should change date", async() => {
      await usecase.execute(payload)
      const updatedConference = await conferenceRepository.findById(testConference.conference1.props.id)
      expect (updatedConference!.props.startDate).toEqual(new Date('2024-05-22T10:00:00.000Z'))
      expect (updatedConference!.props.endDate).toEqual(new Date('2024-05-22T13:00:00.000Z'))
    })

    it("should end mail to all participants", async() => {
      await usecase.execute(payload)
      
      expect(mailer.sentEmails).toEqual([ 
        {
          to: testUsers.bob.props.emailAddress,
          subject:'Dates changing',
          body: `The dates of conference : ${testConference.conference1.props.title} have changed`
        },
      ])
    })

  })

  describe('Scenario: Conference does not exist',() => {
    const payload = {
      user: testUsers.alice,
      conferenceId: 'no-exist',
      startDate: new Date('2024-05-22T10:00:00.000Z'),
      endDate: new Date('2024-05-22T13:00:00.000Z'),
    }

    it("should fail", async() => {
      await expect(usecase.execute(payload)).rejects.toThrow('Conference not found')
      await expectSeatsToRemainUnchanged()
    })
  })

  describe('Scenario: Change conference of someone else',() => {
    const payload = {
      user: testUsers.bob,
      conferenceId: testConference.conference1.props.id,
      startDate: new Date('2024-05-22T10:00:00.000Z'),
      endDate: new Date('2024-05-22T13:00:00.000Z'),
    }

    it("should fail", async() => {
      await expect(usecase.execute(payload)).rejects.toThrow('You are not allowed to update this conference')
      await expectSeatsToRemainUnchanged()
    })
  })


  describe('Scenario: The new date are too close to today',() => { 
    const payload = {
      user: testUsers.alice,
      conferenceId: testConference.conference1.props.id,
      startDate: new Date('2024-01-02T10:00:00.000Z'),
      endDate: new Date('2024-01-01T12:00:00.000ZZ'),
    }

    it("should fail", async() => {
      await expect(usecase.execute(payload)).rejects.toThrow('Conference must happen in at least 3 days')

      await expectSeatsToRemainUnchanged()

    })
  })

})