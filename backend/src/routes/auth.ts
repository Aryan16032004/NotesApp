import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import OTP from '../models/OTP';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = express.Router();

// Email signup: generate OTP and send
router.post('/signup', async (req, res) => {
  const { name, email, dateOfBirth } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  let user = await User.findOne({ email });
  if (user) {
    // Existing user: allow OTP for sign-in
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await OTP.create({ email, otp, expiresAt });
    // Send OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`
    });
    return res.json({ message: 'OTP sent to email' });
  }
  // New user: require name and email
  if (!name) return res.status(400).json({ message: 'Name required for signup' });
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await OTP.create({ email, otp, expiresAt });
  // Send OTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}`
  });
  res.json({ message: 'OTP sent to email' });
});

// Verify OTP and create user
router.post('/verify-otp', async (req, res) => {
  const { name, email, otp, dateOfBirth } = req.body;
  const otpDoc = await OTP.findOne({ email, otp });
  if (!otpDoc || otpDoc.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired OTP' });
  await OTP.deleteOne({ _id: otpDoc._id });
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: name || 'User', email, dateOfBirth });
  } else if (dateOfBirth && !user.dateOfBirth) {
    user.dateOfBirth = dateOfBirth;
    await user.save();
  }
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
  res.json({ token });
});

// Email login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(400).json({ message: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid password' });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
  res.json({ token });
});

// Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || ''
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    // Try to find user by email
    const email = profile.emails?.[0].value;
    user = await User.findOne({ email });
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      await user.save();
    } else {
      // Create new user
      user = await User.create({ name: profile.displayName, email, googleId: profile.id });
    }
  }
  return done(null, user);
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: 'Google login failed' });
  const token = jwt.sign({ id: (user as any)._id, email: (user as any).email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
});

// Get user info
import { authenticateJWT } from '../middleware/auth';
router.get('/me', authenticateJWT, async (req, res) => {
  // @ts-ignore
  const user = await User.findById(req.user.id);
  res.json({ user });
});

export default router;
