import { AwilixContainer } from "awilix";
import { User } from "../../user/entities/user.entity";
import { IFixture } from "../utils/fixture";

export class UserFixture implements IFixture {
  constructor(public entity: User){}

  async load(container: AwilixContainer): Promise<void> {
    const repository = container.resolve('userRepository')
    await repository.create(this.entity)
  }

  createAuthorizationToken(){
    return `Basic ${Buffer.from(`${this.entity.props.emailAddress}:${this.entity.props.password}`).toString('base64')}`
  }
}

