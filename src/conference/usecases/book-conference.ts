import { IMailer } from "../../core/ports/mailer.interface";
import { Executable } from "../../shared/executable";
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository";
import { User } from "../../user/entities/user.entity";
import { Booking } from "../entities/booking.entities";
import { Conference } from "../entities/conference.entity";
import { ConferenceNotFoundError } from "../exceptions/conference-not-found";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { IConferenceRepository } from "../ports/conference-repository.interface";

type BookConferenceRequest = {
  user: User,
  conferenceId: string
};

type BookConferenceResponse = {user: User, conference: Conference};

export class BookConference implements Executable<BookConferenceRequest, BookConferenceResponse> {
  constructor(
    private readonly conferenceRepository: IConferenceRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly mailer: IMailer,
    private readonly userRepository: InMemoryUserRepository
  ) {}

  async execute({ user, conferenceId }: BookConferenceRequest): Promise<BookConferenceResponse> {
    const conference = await this.conferenceRepository.findById(conferenceId);

    if (!conference) {
      throw new ConferenceNotFoundError();
    }

    const bookings = await this.bookingRepository.findByConferenceId(conferenceId);


    const newBooking = new Booking({ userId: user.props.id, conferenceId });

   
    await this.bookingRepository.create(newBooking)

    const alreadyBooked = bookings.some(booking => booking.props.userId === user.props.id);

    if (alreadyBooked) {
      throw new Error("User has already booked for this conference.")
    }
    
    if (bookings.length >= conference.props.seats) {
      throw new Error("No seats available for this conference.")
    }

    await this.bookingRepository.create(newBooking)
    await this.sendConfirmationEmailToUser(user, conference);
    await this.sendNotificationToOrganizer(user, conference);

    return {user, conference};
  }

  private async sendConfirmationEmailToUser(user: User, conference: Conference): Promise<void> {
    await this.mailer.send({
      to: user.props.emailAddress,
      subject: 'Conference Booking Confirmation',
      body: `You have successfully booked a seat for the conference: ${conference.props.title}`
    })
  }

  private async sendNotificationToOrganizer(user: User, conference: Conference) : Promise<void> {
    const organizer = await this.userRepository.findById(conference.props.organizerId)

    if(organizer) {
      await this.mailer.send({
        to: organizer.props.emailAddress,
        subject: 'New Booking Notification',
        body: `A new participant ${user.props.emailAddress} has booked a seat for your conference: ${conference.props.title}`
      })
    }
  }
}
