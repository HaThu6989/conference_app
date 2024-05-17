import { NextFunction, Request, Response } from "express";

export interface ApiResponse {
  success : boolean;
  data: any;
  error? : {
    code: number;
    message: string
  }
}

// entrer dans express et changer express en ajoutant jsonSucess et jsonError
declare module "express-serve-static-core" {
  interface Response {
    jsonSucess (data: any, statusCode: number) : void
    jsonError (data: any, statusCode: number) : void
  }
}

export function jsonResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.jsonSucess = (data: any, statusCode : number) => {
    const response : ApiResponse = {
      success : true,
      data
    }
    res.status(statusCode).json(response)
  }
  res.jsonError = (error: any, statusCode : number) => {
    const response : ApiResponse = {
      success : false,
      data: null,
      error: {
        message: error,
        code : statusCode
      }
    }
    res.status(statusCode).json(response)
  }
  next()
}