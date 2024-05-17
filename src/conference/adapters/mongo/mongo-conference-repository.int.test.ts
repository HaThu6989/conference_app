import { addDays } from "date-fns";
import { Model } from "mongoose";
import { TestApp } from "../../../tests/utils/test-app";
import { Conference } from "../../entities/conference.entity";
import { MongoConference } from "./mongo-conference";
import { MongoConferenceRepository } from "./mongo-conference-repository";

const testIntConference = new Conference({
  id: 'conference-1',
  organizerId: 'organized1',
  title: "ABC",
  startDate: addDays(new Date(), 5),
  endDate: addDays(new Date(), 5),
  seats: 100
})

describe('MongoConferenceRepository', () => {
  let app: TestApp
  let model: Model<MongoConference.ConferenceDocument>
  let repository: MongoConferenceRepository

  beforeEach(async()=>{
    app = new TestApp()
    await app.setup()

    model = MongoConference.ConferenceModel
    repository = new MongoConferenceRepository(model)

    // const record = new model({...testIntConference, _id: testIntConference.props.id})
    const record = new model({
      _id: testIntConference.props.id,
      organizerId: testIntConference.props.organizerId,
      title: testIntConference.props.title,
      startDate: testIntConference.props.startDate,
      endDate: testIntConference.props.endDate,
      seats: testIntConference.props.seats
    })

    await record.save()
  })

  afterAll(async()=>{
    await app.tearDown()
  })

  describe('FindById', () => { 
    it('should find conference by Id', async () => { 
      const conference = await repository.findById('conference-1')
      expect(conference!.props).toEqual(testIntConference.props)
    })

    it('should return null if id not founded', async () => { 
      const conference = await repository.findById('not-existing-id')
      expect(conference!).toBeNull()
    })
   })

  describe('Create', () => { 
    it('should create new conference', async () => { 
      const newConference = new Conference({
        id: 'conference-2',
        organizerId: 'organizer-id',
        title: "Conference 22222",
        startDate: addDays(new Date(), 5),
        endDate: addDays(new Date(), 5),
        seats: 100
      })

      repository.create(newConference)
      const foundConference = repository.findById('conference-2')
      expect(foundConference!).not.toBeNull
    })
   })

   describe('Update', () => { 
    it('should update an existing conference', async () => { 
      const updatedConference = new Conference({
                                ...testIntConference.props, 
                                title: 'Updated conference', 
                                seats: 150}) 

      await repository.update(updatedConference)

      const foundConference = await repository.findById(testIntConference.props.id)

      expect(foundConference!.props.title).toEqual('Updated conference')
      expect(foundConference!.props.seats).toEqual(150)
    })
   })

   describe('Delete', () => { 
    it('should delete the conference', async () => { 
      await repository.delete(testIntConference)

      const deletedConference = await repository.findById(testIntConference.props.id)

      expect(deletedConference!).toBeNull
    })
   })
})