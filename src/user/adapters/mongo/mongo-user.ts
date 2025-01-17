import mongoose, { Document, Schema } from "mongoose"

export namespace MongoUser {// namespace : créer une espace/boîte MongoUser; demain a un autre UserDocument pour mongoAdmin
  export const CollectionName = 'users'

  export interface UserDocument extends Document {
    _id: string
    emailAddress: string
    password: string
  }

  export const UserSchema = new Schema<UserDocument>({
    _id: {
      type: String, 
      required: true
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    }
  }) 

  export const UserModel = mongoose.model<UserDocument>(CollectionName, UserSchema)
}