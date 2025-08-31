import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';

dotenv.config();

const app = express();
app.use(cors({origin:true}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Notes App API');
});

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

export default app;
