import 'dotenv/config'; 
import express from 'express';
import connectDB from './src/services/database.js';
import uploadRouter from './src/api/upload.js';
import statusRouter from './src/api/status.js';
import playRouter from './src/api/play.js';

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());

app.use('/upload', uploadRouter);
app.use('/status', statusRouter);
app.use('/play', playRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});