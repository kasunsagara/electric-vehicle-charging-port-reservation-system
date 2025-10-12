import Contact from '../models/contact.js';

// Controller function for handling form submissions
export async function submitContactForm(req, res) {
  const { name, comment } = req.body;

  const newContact = new Contact({
    name,
    comment
  });

  // Save the contact form to the database
  newContact.save()
    .then(() => {
      res.status(200).json({ message: 'Your message has been submitted successfully!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    });
}

// Controller function to retrieve all contact submissions (optional)
export async function getAllContacts(req, res) {
  // Find all contact submissions in the database
  Contact.find()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Unable to retrieve contact submissions.' });
    });
}

export async function deleteContact(req, res) {
  try {
    const { name } = req.params;  // Access name from URL params

    const deleted = await Contact.deleteOne({ name: name });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        message: 'Contact with the specified name not found',
      });
    }

    res.json({
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}





