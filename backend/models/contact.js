import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
