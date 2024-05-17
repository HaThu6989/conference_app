import { Model } from "mongoose";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../ports/user-repository.interface";
import { MongoUser } from "./mongo-user";

class UserMapper{
  toCore(user: MongoUser.UserDocument) : User {
    return new User({
      id: user._id,
      emailAddress: user.emailAddress,
      password: user.password,
    })
  }

  toPersitence(user: User) : MongoUser.UserDocument {
    return new MongoUser.UserModel({
      _id: user.props.id,
      emailAddress: user.props.emailAddress,
      password: user.props.password,
    })
  }
}

export class MongoUserRepository implements IUserRepository{

  private readonly mapper = new UserMapper()

  constructor(private readonly model: Model<MongoUser.UserDocument>){}

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const user = await this.model.findOne({emailAddress})

    if(!user) return null

    // return new User({
    //   id: user._id,
    //   emailAddress: user.emailAddress,
    //   password: user.password,
    // })
    return this.mapper.toCore(user)
  }

  async create(user: User): Promise<void> {
    // const newUser = new this.model({
    //   _id: user.props.id,
    //   emailAddress: user.props.emailAddress,
    //   password: user.props.password,
    // })
    const newUser = this.mapper.toPersitence(user)
    
    await newUser.save()
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.model.findOne({_id: id})

    if(!user) return null

    return new User({
      id: user._id,
      emailAddress: user.emailAddress,
      password: user.password,
    })
  }
}