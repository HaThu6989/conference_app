import { AwilixContainer } from "awilix";
import { Booking } from "../../conference/entities/booking.entities";
import { IFixture } from "../utils/fixture";

export class BookingFixture implements IFixture {
  constructor(public entity: Booking){}

  async load(container: AwilixContainer): Promise<void> {
    const repository = container.resolve('bookingRepository')
    await repository.create(this.entity)
  }
}