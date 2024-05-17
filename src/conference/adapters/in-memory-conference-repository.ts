import { Conference } from "../entities/conference.entity";
import { IConferenceRepository } from "../ports/conference-repository.interface";

export class InMemoryConferenceRepository implements IConferenceRepository {
  public database: Conference[] = [] 
  // 1 mảng các Conference, giá trị khởi tạo là 1 mảng rỗng  

  async create(conference: Conference) : Promise<void> {
   this.database.push(conference)
  }

  async findById(id: string) : Promise<Conference|null> {
   const conference = this.database.find(conf => conf.props.id === id)
   // new Conference({... conference.initialState}) => créer nouveau valeur initial de la conférence récemment updated
   return conference ? new Conference({... conference.initialState
   }) : null
  }

  async update(conference: Conference): Promise<void> {
    // trouver cet index
    const index = this.database.findIndex(conf => conf.props.id === conference.props.id)
    // modifier cet index
    this.database[index] = conference
    // update valeur
    conference.commit()
  }

   async delete(conference: Conference): Promise<void> {
    const index = this.database.findIndex(conf => conf.props.id === conference.props.id)
    this.database.splice(index, 1)
  }
}