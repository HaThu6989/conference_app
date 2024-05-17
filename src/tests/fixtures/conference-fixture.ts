import { AwilixContainer } from "awilix";
import { Conference } from "../../conference/entities/conference.entity";
import { IFixture } from "../utils/fixture";

// cung cấp một cách để tạo ra và thêm một Conference vào ứng dụng của bạn thông qua container của Awilix.
export class ConferenceFixture implements IFixture {
  constructor(public entity: Conference){}

  // khi co 5 fixtures conférence, invoquer 5 fois load 
  async load(container: AwilixContainer): Promise<void> {
    const repository = container.resolve('conferenceRepository')
    await repository.create(this.entity)
  }
}