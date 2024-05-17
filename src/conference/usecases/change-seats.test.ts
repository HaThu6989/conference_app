import { addDays } from "date-fns"
import { testUsers } from "../../user/tests/user-seeds"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Conference } from "../entities/conference.entity"
import { ChangeSeats } from "./change-seats"

describe('Usecase: Change seats', () => {
  async function expectSeatsToRemainUnchanged () {
    const updatedConference = await conferenceRepository.findById('id-1')
    expect(updatedConference?.props.seats).toEqual(50) 
  }

  const conference = new Conference({
    id: 'id-1',
    organizerId: testUsers.alice.props.id,
    title: 'The pain of OOP',
    seats: 50,
    startDate: addDays(new Date(), 5),
    endDate: addDays(new Date(), 5),
  })

  let usecase: ChangeSeats
  let conferenceRepository: InMemoryConferenceRepository

  beforeEach(async () => {
    conferenceRepository = new InMemoryConferenceRepository()
    await conferenceRepository.create(conference)

    usecase = new ChangeSeats(conferenceRepository)
  })

  describe('Scenario: Happy path', () => {
    it('should change the number of seats', async () => {
      await usecase.execute({
        user: testUsers.alice,
        conferenceId: 'id-1',
        seats: 50
      })

      await expectSeatsToRemainUnchanged()
    })
  })

  describe('Scenario: Conference does not exist', () => {
    it('should fail', async () => {
      await expect(usecase.execute({
        user: testUsers.alice,
        conferenceId: 'id-3',
        seats: 100
      })).rejects.toThrow('Conference not found')
      
      await expectSeatsToRemainUnchanged()
    }) 
  })

  describe('Scenario: Update conference of someone else', () => {
    it('should fail', async () => {
      await expect(usecase.execute({
        user: testUsers.bob,
        conferenceId: 'id-1',
        seats: 100
      })).rejects.toThrow('You are not allowed to update this conference')

      // việc thực hiện usecase.execute không đồng nghĩa với việc lập tức cập nhật thông tin của hội nghị trong conferenceRepository. => update() chua commit()
      // const updatedConference = await conferenceRepository.findById('id-1')
      // expect(updatedConference?.props.seats).toEqual(50) 
      await expectSeatsToRemainUnchanged()
    })
  })

  describe('Scenario: Nb eats between 50 & 1000', () => {
    it('should fail', async () => {
      await expect(usecase.execute({
        user: testUsers.alice,
        conferenceId: 'id-1',
        seats: 1001
      })).rejects.toThrow('The conference must have a minimum of 50 seats & a maximum of 1000 seats')

      await expectSeatsToRemainUnchanged()
    })
  })
})