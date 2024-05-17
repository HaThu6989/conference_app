import { addDays } from "date-fns";
import { testUsers } from "../../user/tests/user-seeds";
import { Conference } from "../entities/conference.entity";

export const testConference = {
  conference1: new Conference({
      id: 'id-1',
      organizerId: testUsers.alice.props.id,
      title: 'The pain of OOP',
      seats: 100,
      startDate: new Date('2024-05-20T10:00:00.000Z'),
      endDate: new Date('2024-05-20T12:00:00.000Z'),
    }
  ),
  conference2: new Conference({
      id: 'id-2',
      organizerId: testUsers.alice.props.id,
      title: 'The pain of OOP 2',
      seats: 100,
      startDate: addDays(new Date(), 5),
      endDate: addDays(new Date(), 5),
    })
  }