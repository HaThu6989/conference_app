import { Request, NextFunction, Response } from "express";
import { User } from "../../../user/entities/user.entity";
import { extractToken } from "../../../core/utils/extract-token";
import { BasicAuthenticator } from "../../../user/services/basic-authenticator";

import container from "../config/dependency-injection";
import { InMemoryUserRepository } from "../../../user/adapters/in-memory-user-repository";

const userRepository = new InMemoryUserRepository()
const authenticator = new BasicAuthenticator(userRepository)

declare module 'express-serve-static-core' {
  interface Request {
    // pas sûr toutes les requetes incluts utilisateur
    user?: User
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = req.headers.authorization // credentials = thông tin xác thực
    if(!credentials) return res.jsonError('Unauthorized', 403)

    const token = extractToken(credentials)

    if(!token) return res.jsonError('Unauthorized', 403)

    // const user = await authenticator.authenticate(token)
    const user = await container.resolve('authenticator').authenticate(token)

    if(!user) return res.jsonError('Unauthorized', 403)

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}