import { NextFunction, Request, Response } from "express";
import { BookConference } from "../../../conference/usecases/book-conference";
import { CancelConference } from "../../../conference/usecases/cancel-conference";
import { ChangeDates } from "../../../conference/usecases/change-date";
import { ChangeSeats } from "../../../conference/usecases/change-seats";
import { User } from "../../../user/entities/user.entity";
import container from "../config/dependency-injection";
import { BookConferenceInputs, CancelConferenceInputs, ChangeDatesInputs, ChangeSeatsInputs, CreateConferenceInputs } from "../dto/conference.dto";
import { RequestValidator } from "../utils/validate-request";

// co container ko can cai nay nua
// const repository = new InMemoryConferenceRepository()
// const idGenerator = new RandomIDGenerator()
// const dateGenerator = new CurrentDateGenerator()
// const organizeConferenceUseCase = new OrganizeConference(repository, idGenerator, dateGenerator)

export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {input, errors} = await RequestValidator(CreateConferenceInputs, req.body)
   
    if(errors) {
      return res.jsonError(errors, 400)
    }

    const result = await container.resolve('organizeConference').execute({
      user: req.user as User,
      title : input.title, 
      seats : input.seats, 
      startDate: new Date(input.startDate), 
      endDate: new Date(input.endDate)
    })
    return res.jsonSucess(result, 201)
  } catch (error) {
    next(error)
  }
}

export const changeSeats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params

    const {input, errors} = await RequestValidator(ChangeSeatsInputs, req.body)

    if(errors){
      return res.jsonError(errors, 400)
    } 

    const result = await (container.resolve('changeSeats') as ChangeSeats).execute({
      user: req.user as User,
      conferenceId: id,
      seats: input.seats, 
    })
    return res.jsonSucess(result, 201)
  } catch (error) {
    next(error)
  }
}

export const changeDates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params
    
    const {input, errors} = await RequestValidator(ChangeDatesInputs, req.body)

    if(errors){
      return res.jsonError(errors, 400)
    } 

    const result = await (container.resolve('changeDates') as ChangeDates).execute({
      user: req.user as User,
      conferenceId: id,
      startDate: input.startDate,
      endDate: input.endDate,
    })

    return res.jsonSucess(result, 201)
  } catch (error) {
    next(error)
  }

  
}


export const bookConference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params    

    const {input, errors} = await RequestValidator(BookConferenceInputs, req.body)

    if(errors){
      return res.jsonError(errors, 400)
    } 

    const result = await (container.resolve('bookConference') as BookConference).execute({
      user: req.user as User,
      conferenceId: id,
    })

    return res.jsonSucess(result, 201)
  } catch (error) {
    next(error)
  }
}

export const cancelConference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params    

    const {input, errors} = await RequestValidator(CancelConferenceInputs, req.body)

    if(errors){
      return res.jsonError(errors, 400)
    } 

    const result = await (container.resolve('cancelConference') as CancelConference).execute({
      organizerId: input.organizerId,
      conferenceId: id,
    })

    return res.jsonSucess(result, 201)
  } catch (error) {
    next(error)
  }
}