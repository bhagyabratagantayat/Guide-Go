const express = require('express');
const router = express.Router();
const AudioGuide = require('../models/AudioGuide');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Get all audio guides
router.get('/', async (req, res) => {
  try {
    const guides = await AudioGuide.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single audio guide
router.get('/:id', async (req, res) => {
  try {
    const guide = await AudioGuide.findById(req.params.id);
    if (guide) {
      res.json(guide);
    } else {
      res.status(404).json({ message: 'Audio guide not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create audio guide (Admin only)
router.post('/', authenticateUser, authorizeRole('admin'), async (req, res) => {
  console.log('POST /api/audio-guides hit with body:', req.body);
  try {
    const guide = new AudioGuide(req.body);
    const createdGuide = await guide.save();
    res.status(201).json(createdGuide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update audio guide (Admin only)
router.put('/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const guide = await AudioGuide.findById(req.params.id);
    if (guide) {
      Object.assign(guide, req.body);
      const updatedGuide = await guide.save();
      res.json(updatedGuide);
    } else {
      res.status(404).json({ message: 'Audio guide not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete audio guide (Admin only)
router.delete('/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const guide = await AudioGuide.findById(req.params.id);
    if (guide) {
      await guide.deleteOne();
      res.json({ message: 'Audio guide removed' });
    } else {
      res.status(404).json({ message: 'Audio guide not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
