import express from 'express';
import Note from '../models/Note';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create note
router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });
  const note = await Note.create({ userId: req.user.id, content });
  res.json({ note });
});

// Get notes
router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json({ notes });
});

// Delete note
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Note deleted' });
});

export default router;
