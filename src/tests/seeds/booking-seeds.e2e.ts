import { Booking } from "../../conference/entities/booking.entities";
import { BookingFixture } from "../fixtures/booking-fixture";
import { e2eConference } from "./conference-seeds.e2e";
import { e2eUsers } from "./user-seeds.e2e";

export const e2eBooking = {
  bobBooking: new BookingFixture(
    new Booking({
      userId: e2eUsers.bob.entity.props.id,
      conferenceId: e2eConference.conference_poo.entity.props.id
    })
  )
}