import { Executable } from "../../shared/executable"
import { User } from "../../user/entities/user.entity"
import { ConferenceNotFoundError } from "../exceptions/conference-not-found"
import { ConferenceUpdateForbidden } from "../exceptions/conference-update-forbidden"
import { IConferenceRepository } from "../ports/conference-repository.interface"

type ChangeSeatsRequest = {
  conferenceId: string,
  seats: number,
  user: User
}

type ChangeSeatsResponse = void

export class ChangeSeats implements Executable<ChangeSeatsRequest,ChangeSeatsResponse>{
  constructor(
    private readonly conferenceRepository: IConferenceRepository
  ){}

  async execute ({conferenceId,seats,user}: ChangeSeatsRequest) : Promise<ChangeSeatsResponse> {
    const conference = await this.conferenceRepository.findById(conferenceId)

    if(!conference) {
      // throw new Error('Conference not found')
      throw new ConferenceNotFoundError()
    }

    if(!conference.isTheOrganizer(user)) {
      throw new ConferenceUpdateForbidden()
    }
    
    // 1: On met à jour notre conférence 
    conference!.update({seats})

    if(conference.hasNotEnoughSeats() || conference.hasTooManySeats()) {
      throw new Error('The conference must have a minimum of 50 seats & a maximum of 1000 seats')
    }
    
    // 2: et enregistrer conference dans notre bdd(in memory)
    this.conferenceRepository.update(conference)
  }
}