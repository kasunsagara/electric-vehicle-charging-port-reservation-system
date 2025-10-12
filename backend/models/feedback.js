import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
});

const Feedback = mongoose.model('Feedback', contactSchema);

export default Feedback;
