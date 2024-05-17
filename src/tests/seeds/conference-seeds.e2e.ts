import { addDays } from "date-fns";
import { Conference } from "../../conference/entities/conference.entity";
import { ConferenceFixture } from "../fixtures/conference-fixture";
import { e2eUsers } from "./user-seeds.e2e";

export const e2eConference = {
  conference_poo: new ConferenceFixture(
    new Conference({
      id: 'id-1',
      organizerId: e2eUsers.johnDoe.entity.props.id,
      title: 'The pain of OOP',
      seats: 100,
      startDate: addDays(new Date(), 5),
      endDate: addDays(new Date(), 5),
    })
  ),
  conference_poo2: new ConferenceFixture(
    new Conference({
      id: 'id-2',
      organizerId: e2eUsers.johnDoe.entity.props.id,
      title: 'The pain of OOP 2',
      seats: 100,
      startDate: addDays(new Date(), 5),
      endDate: addDays(new Date(), 5),
    })
  )
}