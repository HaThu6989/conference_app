import { IDateGenerator } from "../../core/ports/date-generator.interface";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { Executable } from "../../shared/executable";
import { User } from "../../user/entities/user.entity";
import { Conference } from "../entities/conference.entity";
import { ConferenceTooEarly } from "../exceptions/conference-too-early";
import { IConferenceRepository } from "../ports/conference-repository.interface";

type OrganizeConferenceRequest = {
  user: User,
  title: string,
  startDate: Date,
  endDate: Date,
  seats: number
}

type OrganizeConferenceResponse = {id: string}

export class OrganizeConference implements Executable<OrganizeConferenceRequest,OrganizeConferenceResponse>{
  constructor(
    private readonly repository: IConferenceRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  // async execute (data: {user : User,title: string, startDate: Date, endDate: Date, seats: number}) {
  async execute (data: OrganizeConferenceRequest) :  Promise<OrganizeConferenceResponse>{
    const id = this.idGenerator.generate()

    const newConference = new Conference(
      {id, 
      organizerId: data.user.props.id,
      title: data.title, 
      startDate: data.startDate,
      endDate: data.endDate, 
      seats: data.seats}
    )

    if(newConference.isTooClose(this.dateGenerator.now())) {
      throw new ConferenceTooEarly()
    }

    if(newConference.hasTooManySeats()){
      throw new Error("Conference must happen in at least 3 days")
    }

    if(newConference.hasNotEnoughSeats()){
      throw new Error("The conference must have a minimum of 50 seats")
    }

    if(newConference.isTooLong()){
      throw new Error("The conference must have a duration less than 3 hours")
    }

    // sinon créer new
    await this.repository.create(newConference)

    return {id}
  }
}