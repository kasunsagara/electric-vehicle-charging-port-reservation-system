import Feedback from '../models/feedback.js';

// Controller function for handling form submissions
export async function submitFeedbackForm(req, res) {
  const { name, message } = req.body;

  const newFeedback = new Feedback({
    name,
    message
  });

  // Save the contact form to the database
  newFeedback.save()
    .then(() => {
      res.status(200).json({ message: 'Your message has been submitted successfully!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    });
}

// Controller function to retrieve all contact submissions (optional)
export async function getAllFeedbacks(req, res) {
  // Find all contact submissions in the database
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
    const { id } = req.params;  // ID එක ගන්න

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





