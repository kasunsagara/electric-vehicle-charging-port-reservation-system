import Feedback from '../models/feedback.js';

export async function submitFeedback(req, res) {
  const { name, message } = req.body;

  const newFeedback = new Feedback({
    name,
    message
  });

  newFeedback.save()
    .then(() => {
      res.status(200).json({ message: 'Your message has been submitted successfully!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    });
}

export async function getFeedbacks(req, res) {
  Feedback.find()
    .then((feedback) => {
      res.status(200).json(feedback);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Unable to retrieve feedback submissions.' });
    });
}

export async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;  

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Feedback not found',
      });
    }

    res.json({
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}





