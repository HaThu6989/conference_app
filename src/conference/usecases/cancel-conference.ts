import { IMailer } from "../../core/ports/mailer.interface";
import { Executable } from "../../shared/executable";
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository";
import { Booking } from "../entities/booking.entities";
import { Conference } from "../entities/conference.entity";
import { ConferenceNotFoundError } from "../exceptions/conference-not-found";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { IConferenceRepository } from "../ports/conference-repository.interface";

type CancelConferenceRequest = {
  organizerId: string,
  conferenceId: string
};

type CancelConferenceResponse = void;

export class CancelConference implements Executable<CancelConferenceRequest, CancelConferenceResponse> {
  constructor(
    private readonly conferenceRepository: IConferenceRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly mailer: IMailer,
    private readonly userRepository: InMemoryUserRepository
  ) {}

  async execute({ organizerId, conferenceId }: CancelConferenceRequest): Promise<CancelConferenceResponse> {
    const conference = await this.conferenceRepository.findById(conferenceId);

    if (!conference) {
      throw new ConferenceNotFoundError();
    }

    if (conference.props.organizerId !== organizerId) {
      throw new Error("Only the organizer can cancel this conference.");
    }

    const bookings = await this.bookingRepository.findByConferenceId(conferenceId);

    await this.bookingRepository.removeByConferenceId(conferenceId);

    await this.conferenceRepository.delete(conference)

    await this.sendNoticationToParticipants(bookings, conference);
  }

  private async sendNoticationToParticipants(bookings: Booking[], conference: Conference): Promise<void> {
    for (const booking of bookings) {
      const user = await this.userRepository.findById(booking.props.userId);
      if (user) {
        await this.mailer.send({
          to: user.props.emailAddress,
          subject: 'Conference Cancellation Notice',
          body: `We regret to inform you that the conference: ${conference.props.title} has been cancelled.`
        });
      }
    }
  }
}
