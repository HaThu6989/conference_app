import { Booking } from "../entities/booking.entities";

export interface IBookingRepository{
  create(booking: Booking): Promise<void>,
  findByConferenceId(id: string): Promise<Booking[]>
  removeByConferenceId(id: string): Promise<void>
}