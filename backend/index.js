import express from 'express';

const app = express();

const mongoUrl = "mongodb+srv://kasunsagara689:56649901@cluster0.hulg4fz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});