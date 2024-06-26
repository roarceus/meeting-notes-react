import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import meetingNoteRoutes from './routes/meetingNoteRoutes.js';

const app = express();
app.use(cors());
const PORT = 27017; //Default port for MongoDB
const MONGODB_URI = 'mongodb+srv://patilsohan:mongo123@cloudcluster.eqm0jqz.mongodb.net/meeting-notes?retryWrites=true&w=majority&appName=cloudcluster';

app.use(express.json());
app.use('/meeting-notes', meetingNoteRoutes); //route for API request

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error.message));

export default app;
