import { Conference } from "../entities/conference.entity"

export interface IConferenceRepository {
  create(conference: Conference) : Promise<void>
  findById(id: string) : Promise<Conference|null>
  update(conference: Conference) : Promise<void>
  delete(conference: Conference) : Promise<void>
}  

// đều trả về Promise vì các hoạt động mà chúng thực hiện có thể mất thời gian và không đồng bộ.
