import Feedback from '../models/feedback.js';

export async function submitFeedback(req, res) {
  try {
    const { name, message } = req.body;

    const newFeedback = new Feedback({
      name,
      message
    });

    await newFeedback.save();

    res.status(200).json({
      message: "Your message has been submitted successfully!"
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong. Please try again later."
    });
  }
}

export async function getFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find();

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve feedback submissions."
    });
  }
}

export async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;  

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.json({
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}





