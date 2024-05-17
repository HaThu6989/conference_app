import { Model } from "mongoose"
import { TestApp } from "../../../tests/utils/test-app"
import { testUsers } from "../../tests/user-seeds"
import { MongoUser } from "./mongo-user"
import { MongoUserRepository } from "./mongo-user-repository"

describe('MongoUserRepository', ()=> {
  let app : TestApp
  let model: Model<MongoUser.UserDocument>
  let repository: MongoUserRepository
  let record: MongoUser.UserDocument

  beforeEach(async()=>{
    app = new TestApp()
    await app.setup()

    model = MongoUser.UserModel
    // await model.deleteMany({})

    record = new model({
      _id: testUsers.alice.props.id,
      emailAddress: testUsers.alice.props.emailAddress,
      password: testUsers.alice.props.password
    })

    await record.save()

    repository = new MongoUserRepository(model)
  })
  
  afterAll(async() => {
    await app.tearDown()
  })

  describe('findByEmail', ()=> {
    it('should the user corresponding to the email', async() => {
      const user = await repository.findByEmailAddress(testUsers.alice.props.emailAddress)

      expect(user!).toBeDefined
      expect(user!.props.id).toBe('alice')
      expect(user!.props.emailAddress).toBe('alice@gmail.com')
      expect(user!.props.password).toBe('qwerty')
    })

    it('should return null if no user', async() => {
      const user = await repository.findByEmailAddress('no-existing-email@gmail.com')
      expect(user).toBeNull
    })
  })

  describe('findById', ()=> {
    it('should the user corresponding to the ID', async() => {
      const user = await repository.findById(testUsers.alice.props.id)

      expect(user!).toBeDefined
      expect(user!.props.id).toBe('alice')
      expect(user!.props.emailAddress).toBe('alice@gmail.com')
      expect(user!.props.password).toBe('qwerty')
    })

    it('should return null if no user', async() => {
      const user = await repository.findById('no-existing-id')
      expect(user).toBeNull
    })
  })

  describe('Create', ()=> {
    it('should create new user', async() => {
      await repository.create(testUsers.bob)
      const foundUser = await model.findOne({emailAddress: testUsers.bob.props.emailAddress})

      expect(foundUser!.toObject()).toEqual({
        _id: 'bob',
        emailAddress: 'bob@gmail.com',
        password: 'qwerty',
        __v: 0
      })

    })

    it('should return null if no user', async() => {
      const user = await repository.findById('no-existing-id')
      expect(user).toBeNull
    })
  })
})