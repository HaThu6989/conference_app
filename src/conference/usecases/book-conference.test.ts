import { InMemoryMailer } from "../../core/adapters/in-memory-mailer"
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository"
import { testUsers } from "../../user/tests/user-seeds"
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Booking } from "../entities/booking.entities"
import { testConference } from "../tests/conference-seeds"
import { BookConference } from "./book-conference"

describe('Feature: Reserve booking', () => { 
  let usecase: BookConference
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

    usecase = new BookConference(
      conferenceRepository, 
      bookingRepository, 
      mailer, 
      userRepository
    )
  })

  describe('Scenario: Happy path', () => { 
    const payload = {
      user: testUsers.anna, 
      conferenceId: testConference.conference1.props.id
    }

    it('should create new booking and send emails to participants & organizer', async () => {
      const result = await usecase.execute(payload);

      expect(result.user.props.emailAddress).toBe(testUsers.anna.props.emailAddress)      
      expect(result.conference.props.organizerId).toBe(testUsers.alice.props.id)   

      expect(mailer.sentEmails[0].to).toBe(testUsers.anna.props.emailAddress); 
      expect(mailer.sentEmails[1].to).toBe(testUsers.alice.props.emailAddress);
    });
  });
  
  describe('Scenario: Conference is full', () => { 
    it('should throw an error when the conference is full', async () => {
      const maxSeats = testConference.conference1.props.seats;
      for (let i = 0; i < maxSeats; i++) {
        const booking = new Booking({
          userId: testUsers.alice.props.id,
          conferenceId: testConference.conference1.props.id
        });
        await bookingRepository.create(booking);
      }

      const payload = {
        user: testUsers.bob,
        conferenceId: testConference.conference1.props.id
      };

      await expect(usecase.execute(payload)).rejects.toThrowError("No seats available for this conference.");
    });
  });

  describe('Scenario: User already booked', () => { 
    it('should throw an error when the user has already booked for the conference', async () => {
      const booking = new Booking({
        userId: testUsers.bob.props.id,
        conferenceId: testConference.conference1.props.id
      });
      await bookingRepository.create(booking);

      const payload = {
        user: testUsers.bob,
        conferenceId: testConference.conference1.props.id
      };

      await expect(usecase.execute(payload)).rejects.toThrowError("User has already booked for this conference.");
    });
  });

 })