import express from 'express';
import { submitFeedbackForm, getAllFeedbacks, deleteFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post("/submit", submitFeedbackForm);
feedbackRouter.get("/all", getAllFeedbacks);
feedbackRouter.delete("/:name", deleteFeedback);


export default feedbackRouter;
