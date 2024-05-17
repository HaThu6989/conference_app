import { IDateGenerator } from "../../core/ports/date-generator.interface"
import { IMailer } from "../../core/ports/mailer.interface"
import { Executable } from "../../shared/executable"
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository"
import { User } from "../../user/entities/user.entity"
import { Conference } from "../entities/conference.entity"
import { ConferenceNotFoundError } from "../exceptions/conference-not-found"
import { ConferenceTooEarly } from "../exceptions/conference-too-early"
import { ConferenceUpdateForbidden } from "../exceptions/conference-update-forbidden"
import { IBookingRepository } from "../ports/booking-repository.interface"
import { IConferenceRepository } from "../ports/conference-repository.interface"

type ChangeDateRequest = {
  user: User,
  conferenceId: string,
  startDate: Date,
  endDate: Date,
}

type ChangeDateResponse = void

export class ChangeDates implements Executable<ChangeDateRequest, ChangeDateResponse>{
   constructor(
    private readonly conferenceRepository: IConferenceRepository,
    private readonly dateGenerator: IDateGenerator,
    private readonly bookingRepository: IBookingRepository,
    private readonly mailer: IMailer,
    private readonly userRepository: InMemoryUserRepository
  ){}

   async execute({user, conferenceId, startDate, endDate} : ChangeDateRequest): Promise<void> { 
    const conference = await this.conferenceRepository.findById(conferenceId)

    if(!conference) {
      // throw new Error('Conference not found')
      throw new ConferenceNotFoundError()
    }

      conference.update({
      startDate, endDate
    })

    // Phai sau update moi test dc
    if(!conference.isTheOrganizer(user)) {
      // throw new Error('You are not allowed to update this conference')
      throw new ConferenceUpdateForbidden()
    }
    
    if(conference.isTooClose(this.dateGenerator.now())) {
      throw new ConferenceTooEarly()
    }
    // co commit luon trong nays
    await this.conferenceRepository.update(conference)

    await this.sendEmailToAllParticipants(conference)
   return 
  }

  private async sendEmailToAllParticipants(conference: Conference): Promise<void> {
    const bookings = await this.bookingRepository.findByConferenceId(conference.props.id)
    
    // Promise.all() dug khi trong lopp co function async
    const participants = await Promise.all(
      bookings
        .map(booking => this.userRepository.findById(booking.props.userId))
        .filter(participant => participant !== null)
    ) as User[]

    // sau khi commit => gui mail
    // await this.mailer.send({ // gui cho 1 ng
    //   to: 'bob@gmail.com',
    //   subject:'Dates changing',
    //   body: `The dates of conference : ${conference.props.title} have changed`
    // })
    await Promise.all( // gui cho nhieu ng
      participants.map(participant => this.mailer.send({
        to: participant.props.emailAddress,
        subject:'Dates changing',
        body: `The dates of conference : ${conference.props.title} have changed`
      }))
    )

    return
  }
}