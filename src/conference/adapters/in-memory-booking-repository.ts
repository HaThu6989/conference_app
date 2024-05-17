import { Booking } from "../entities/booking.entities";
import { IBookingRepository } from "../ports/booking-repository.interface";

export class InMemoryBookingRepository implements IBookingRepository{
  public database: Booking[]=[]

  async create(booking: Booking): Promise<void>{
    this.database.push(booking)
  }

  async findByConferenceId(id: string): Promise<Booking[]> {
    return this.database.filter(booking => booking.props.conferenceId === id)
  }
  
  async removeByConferenceId(id: string): Promise<void> {
    this.database = this.database.filter(booking => booking.props.conferenceId !== id);
  }
}