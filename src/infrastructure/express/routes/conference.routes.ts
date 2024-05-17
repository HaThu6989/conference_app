import express from "express"
import { bookConference, cancelConference, changeDates, changeSeats, organizeConference } from "../controllers/conference.controllers"
import { isAuthenticated } from "../middlewares/authentication.middleware"

const router = express.Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference)
router.post('/conference/:id/book', bookConference)
router.delete('/conference/:id', cancelConference)
router.put('/conference/:id/seats', changeSeats)
router.put('/conference/:id/dates', changeDates)

export default router