import { Model } from "mongoose";
import { Conference } from "../../entities/conference.entity";
import { IConferenceRepository } from "../../ports/conference-repository.interface";
import { MongoConference } from "./mongo-conference";


// Mapper class để chuyển đổi dữ liệu giữa mô hình ứng dụng và mô hình lưu trữ
class ConferenceMapper{

  // Phương thức chuyển đổi từ document MongoDB sang đối tượng Conference của ứng dụng
  toCore(conferenceDoc: MongoConference.ConferenceDocument) : Conference{
    return new Conference({
      id: conferenceDoc._id,
      organizerId: conferenceDoc.organizerId,
      title: conferenceDoc.title,
      startDate: conferenceDoc.startDate,
      endDate: conferenceDoc.endDate,
      seats: conferenceDoc.seats
    })
  }

  // Phương thức chuyển đổi từ đối tượng Conference của ứng dụng sang document MongoDB
  toPersistence(conference: Conference) : MongoConference.ConferenceDocument{
    return new MongoConference.ConferenceModel({
      _id: conference.props.id,
      organizerId: conference.props.organizerId,
      title: conference.props.title,
      startDate: conference.props.startDate,
      endDate: conference.props.endDate,
      seats: conference.props.seats
    })
  }
}

// Repository class để xử lý các thao tác CRUD cho đối tượng Conference sử dụng MongoDB
export class MongoConferenceRepository implements IConferenceRepository{
  private readonly mapper = new ConferenceMapper()
  
  constructor(
    private readonly model: Model<MongoConference.ConferenceDocument>
  ){}

  async create(conference: Conference): Promise<void> {
    const conferenceDoc = this.mapper.toPersistence(conference)
    await conferenceDoc.save()
  }

  async findById(id: string): Promise<Conference | null> {
    const conference = await this.model.findOne({_id:id})
    if(!conference) return null
    return this.mapper.toCore(conference)
  }

  async update(conference: Conference): Promise<void> {
    const conferenceDoc = this.mapper.toPersistence(conference)
    await this.model.updateOne({_id: conference.props.id}, conferenceDoc)
  }

  async delete(conference: Conference): Promise<void> {
    await this.model.deleteOne({_id: conference.props.id})
  }
}