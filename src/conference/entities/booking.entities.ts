import { Entity } from "../../shared/entity"

type BookingProps = {
  userId: string,
  conferenceId: string
}

export class Booking extends Entity<BookingProps>{}