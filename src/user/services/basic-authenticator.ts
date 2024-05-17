import { User } from "../entities/user.entity";
import { IUserRepository } from "../ports/user-repository.interface";

import { IAuthenticator } from "./authenticator.interface";

export class BasicAuthenticator implements IAuthenticator {
  constructor(
    private readonly userRepository: IUserRepository
  ){}

  async authenticate(token: string) : Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8') // johndoe@gmail.com:qwerty
    
    const [emailAddress, password] = decoded.split(':') // [johndoe@gmail.com,qwerty]

    const user = await this.userRepository.findByEmailAddress(emailAddress)

    if(!user || user.props.password !== password) {
      throw new Error("User/Password is wrong")
    }
    return user
  }
}