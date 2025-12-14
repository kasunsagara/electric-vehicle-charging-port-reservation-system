import express from 'express';
import { submitFeedback, getFeedbacks, deleteFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/", submitFeedback);
feedbackRouter.get("/", getFeedbacks);
feedbackRouter.delete("/:id", deleteFeedback);


export default feedbackRouter;
