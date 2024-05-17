import { InMemoryUserRepository } from "../adapters/in-memory-user-repository"
import { User } from "../entities/user.entity"
import { BasicAuthenticator } from "./basic-authenticator"

describe("Authenticator",() => {
  let userRepository: InMemoryUserRepository
  let authenticator: BasicAuthenticator

  beforeEach(async() => {
    userRepository = new InMemoryUserRepository ()

    await userRepository.create(
      new User({
        id: 'id-1',
        emailAddress: 'johndoe@gmail.com',
        password: 'qwerty'
      })
    )
    authenticator = new BasicAuthenticator(userRepository)
  })


  describe("Scenario: token is valid",() => {
    it('should authenticate a user', async () => {
      const payload = Buffer.from('johndoe@gmail.com:qwerty').toString('base64') // encode johndoe@gmail.com:qwerty - 'am9obmRvZUBnbWFpbC5jb206cXdlcnR5'
      const user = await authenticator.authenticate(payload)
  
      expect(user.props).toEqual({
        id: 'id-1',
        emailAddress: 'johndoe@gmail.com',
        password: 'qwerty'
      })
    })
  })

  describe("Scenario: token is invalid",() => {
    it('should throw an error', async () => {
      const payload = Buffer.from('unknown@gmail.com:qwerty').toString('base64')
       expect(authenticator.authenticate(payload)).rejects.toThrow("User/Password is wrong")
    })
  })

  describe("Scenario: password is invalid",() => {
    it('should throw an error', async () => {
      const payload = Buffer.from('johndoe@gmail.com:dddddd').toString('base64')
       expect(authenticator.authenticate(payload)).rejects.toThrow("User/Password is wrong")
    })
  })
})