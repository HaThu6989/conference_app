import { InMemoryMailer } from "../../core/adapters/in-memory-mailer"
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository"
import { testUsers } from "../../user/tests/user-seeds"
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Booking } from "../entities/booking.entities"
import { testConference } from "../tests/conference-seeds"
import { CancelConference } from "./cancel-conference"

describe('Feature: Cancel Conference', () => { 
  let usecase: CancelConference
  let conferenceRepository: InMemoryConferenceRepository
  let bookingRepository: InMemoryBookingRepository
  let mailer: InMemoryMailer
  let userRepository: InMemoryUserRepository

  beforeEach(async ()=>{
    conferenceRepository = new InMemoryConferenceRepository()
    await conferenceRepository.create(testConference.conference1)

    bookingRepository = new InMemoryBookingRepository()

    userRepository = new InMemoryUserRepository()
    await userRepository.create(testUsers.alice)
    await userRepository.create(testUsers.bob)
    await userRepository.create(testUsers.anna);

    mailer = new InMemoryMailer()

    usecase = new CancelConference(
      conferenceRepository, 
      bookingRepository, 
      mailer, 
      userRepository
    )

    await bookingRepository.create(new Booking({ 
      userId: testUsers.anna.props.id, 
      conferenceId: testConference.conference1.props.id 
    }));

    await bookingRepository.create(new Booking({ 
      userId: testUsers.bob.props.id, 
      conferenceId: testConference.conference1.props.id 
    }));
  })

  describe('Scenario: Happy path', () => { 
    const payload = {
      organizerId: testUsers.alice.props.id,
      conferenceId: testConference.conference1.props.id
    }

    it('should cancel the conference, remove bookings, and send emails to participants', async () => {
      const conference = conferenceRepository.findById(testConference.conference1.props.id)

      await usecase.execute(payload);

      expect(conference).toBeNull

      expect(mailer.sentEmails.length).toBe(2);
      expect(mailer.sentEmails[0].to).toBe(testUsers.anna.props.emailAddress);
      expect(mailer.sentEmails[1].to).toBe(testUsers.bob.props.emailAddress);
    });
  });
  
  describe('Scenario: Only organizer can cancel conference', () => {
    const payload = {
      organizerId: testUsers.bob.props.id,
      conferenceId: testConference.conference1.props.id
    };

    it('should throw an error when a non-organizer tries to cancel the conference', async () => {
      await expect(usecase.execute(payload)).rejects.toThrowError("Only the organizer can cancel this conference.");
    });
  });
})