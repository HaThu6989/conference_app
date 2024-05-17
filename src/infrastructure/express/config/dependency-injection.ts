import { asClass, asValue, createContainer } from "awilix";
import { InMemoryBookingRepository } from "../../../conference/adapters/in-memory-booking-repository";
import { BookConference } from "../../../conference/usecases/book-conference";
import { CancelConference } from "../../../conference/usecases/cancel-conference";
import { ChangeDates } from "../../../conference/usecases/change-date";
import { ChangeSeats } from "../../../conference/usecases/change-seats";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { CurrentDateGenerator } from "../../../core/adapters/current-date-generator";
import { InMemoryMailer } from "../../../core/adapters/in-memory-mailer";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { BasicAuthenticator } from "../../../user/services/basic-authenticator";

import { MongoConference } from "../../../conference/adapters/mongo/mongo-conference";
import { MongoConferenceRepository } from "../../../conference/adapters/mongo/mongo-conference-repository";
import { MongoUser } from "../../../user/adapters/mongo/mongo-user";
import { MongoUserRepository } from "../../../user/adapters/mongo/mongo-user-repository";

// import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";
// import { InMemoryUserRepository } from "../../../user/adapters/in-memory-user-repository";

const container = createContainer()

container.register({
  // conferenceRepository : asClass(InMemoryConferenceRepository).singleton(),
  idGenerator: asClass(RandomIDGenerator).singleton(),
  dateGenerator: asClass(CurrentDateGenerator).singleton(),
  // userRepository: asClass(InMemoryUserRepository).singleton(),
  bookingRepository: asClass(InMemoryBookingRepository).singleton(),
  mailer: asClass(InMemoryMailer).singleton(),
    
  conferenceRepository : asValue(new MongoConferenceRepository(MongoConference.ConferenceModel)),
  userRepository: asValue(new MongoUserRepository(MongoUser.UserModel))
})

const conferenceRepository = container.resolve('conferenceRepository')
const idGenerator = container.resolve('idGenerator')
const dateGenerator = container.resolve('dateGenerator')
const userRepository = container.resolve('userRepository')
const bookingRepository = container.resolve('bookingRepository')
const mailer = container.resolve('mailer')

container.register({
  organizeConference: asValue(new OrganizeConference(conferenceRepository, idGenerator, dateGenerator)),
  changeSeats: asValue(new ChangeSeats(conferenceRepository)),
  changeDates: asValue(new ChangeDates(
                                        conferenceRepository, 
                                        dateGenerator, 
                                        bookingRepository, 
                                        mailer,
                                        userRepository)),
  authenticator: asValue(new BasicAuthenticator(userRepository)),
  bookConference: asValue(new BookConference(
                                              conferenceRepository, 
                                              bookingRepository, 
                                              mailer,
                                              userRepository
                                              )),
  cancelConference: asValue(new CancelConference(
                                                  conferenceRepository, 
                                                  bookingRepository, 
                                                  mailer,
                                                  userRepository
                                                  ))                                         
})

export default container