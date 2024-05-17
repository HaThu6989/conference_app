import mongoose, { Document, Schema } from "mongoose";

// Tạo một namespace để chứa các mã liên quan đến MongoDB cho đối tượng Conference
export namespace MongoConference {
  export const CollectionName = 'conferences'


  // Định nghĩa giao diện cho một document của Conference trong MongoDB
  export interface ConferenceDocument extends Document{
    _id: string,
    organizerId: string,
    title: string,
    startDate: Date,
    endDate: Date,
    seats: number
  }

  // Định nghĩa schema cho collection Conference
  export const ConferenceSchema = new Schema<ConferenceDocument>({
    _id: {type: String, required: true},
    organizerId: {type: String, required: true},
    title: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    seats: {type: Number, required: true},
  })

  // Tạo model từ schema vừa định nghĩa để làm việc với MongoDB
  export const ConferenceModel = mongoose.model<ConferenceDocument>(CollectionName, ConferenceSchema)
}