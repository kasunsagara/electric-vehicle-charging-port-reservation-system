import express from 'express';
import { submitFeedbackForm, getAllFeedbacks, deleteFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/", submitFeedbackForm);
feedbackRouter.get("/", getAllFeedbacks);
feedbackRouter.delete("/:id", deleteFeedback);


export default feedbackRouter;
