import { FixedDateGenerator } from "../../core/adapters/fixed-date-generator"
import { FixedIDGenerator } from "../../core/adapters/fixed-id-generator"
import { testUsers } from "../../user/tests/user-seeds"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Conference } from "../entities/conference.entity"
import { OrganizeConference } from "./organize-conference"


describe("Usecase: Organize Conference",  () => {
  function expectConference  (conference: Conference) {
    expect(conference.props).toEqual({
      id: "id-1",
      organizerId: testUsers.alice.props.id,
      title: "My first conference",
      startDate: new Date("2024-01-05T10:00:00.000Z"),
      endDate: new Date("2024-01-05T11:00:00.000Z"),
      seats: 100
    })
  }

  let repository : InMemoryConferenceRepository
  let idGenerator : FixedIDGenerator
  let dateGenerator : FixedDateGenerator
  let usecase : OrganizeConference

  beforeEach (() => {
    repository = new InMemoryConferenceRepository()
    idGenerator = new FixedIDGenerator()
    dateGenerator = new FixedDateGenerator()
    usecase = new OrganizeConference(repository, idGenerator, dateGenerator)
  })
 

  describe("Scenario : Happy path", () => {
    const payload = {
      user: testUsers.alice,
      title: "My first conference",
      startDate: new Date("2024-01-05T10:00:00.000Z"),
      endDate: new Date("2024-01-05T11:00:00.000Z"),
      seats: 100
    }

    it("should return the ID", async () => {
      const result = await usecase.execute(payload)
      expect(result.id).toBe("id-1")
    })

    it("should create a conference", async () => {
      const result = await usecase.execute(payload)
  
      expect(repository.database.length).toBe(1)
      const createdConference = repository.database[0]
      expectConference(createdConference)
    })
  })

  describe("Scenario : the conference happens too soon", () => {
    const payload = {
      user: testUsers.alice,
      title: "My first conference",
      startDate: new Date("2024-01-02T10:00:00.000Z"),
      endDate: new Date("2024-01-02T11:00:00.000Z"),
      seats: 100
    }

    it("should throw an error", async() => {
      await expect (() => usecase.execute(payload)).rejects.toThrow("Conference must happen in at least 3 days")
    })

    it("should not create the conference", async() => {
      try {
        await usecase.execute(payload)
      } catch (error) {
        expect(repository.database.length).toBe(0)
      }
    })
  })

  describe("Scenario : the conference happens too many seats", () => {
    const payload = {
      user: testUsers.alice,
      title: "My first conference",
      startDate: new Date("2024-01-05T10:00:00.000Z"),
      endDate: new Date("2024-01-05T11:00:00.000Z"),
      seats: 10001
    }

    it("should throw an error", async () => {
      await expect(() => usecase.execute(payload)).rejects.toThrow("Conference must happen in at least 3 days")
    })

    it("should not create the conference", async () => {
      try {
        await usecase.execute(payload)
      } catch (error) {
        expect(repository.database.length).toBe(0)
      }
    })

  })

  describe("Scenario : the conference has not enought seats", () => {
    const payload = {
      user: testUsers.alice,
      title: "My first conference",
      startDate: new Date("2024-01-05T10:00:00.000Z"),
      endDate: new Date("2024-01-05T11:00:00.000Z"),
      seats: 49
    }

    it("should throw an error", async () => {
      await expect(() => usecase.execute(payload)).rejects.toThrow("The conference must have a minimum of 50 seats")
    })

    it("should not create the conference", async () => {
      try {
        await usecase.execute(payload)
      } catch (error) {
        expect(repository.database.length).toBe(0)
      }
    })

  })

  describe("Scenario : the conference must have a duration less than 3 hours", () => {
    const payload = {
      user: testUsers.alice,
      title: "My first conference",
      startDate: new Date("2024-01-05T10:00:00.000Z"),
      endDate: new Date("2024-01-05T15:00:00.000Z"),
      seats: 100
    }

    it("should throw an error", async () => {
      await expect(() => usecase.execute(payload)).rejects.toThrow("The conference must have a duration less than 3 hours")
    })

    it("should not create the conference", async () => {
      try {
        await usecase.execute(payload)
      } catch (error) {
        expect(repository.database.length).toBe(0)
      }
    })

  })
})

