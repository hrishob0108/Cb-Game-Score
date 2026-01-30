const express = require('express');
const router = express.Router();
const Admin = require('../model/admin');

// CREATE - Add a new admin entry
router.post('/admin', async (req, res) => {
  try {
    const { teamName, squidScore } = req.body;

    if (!teamName || squidScore === undefined) {
      return res.status(400).json({ error: 'teamName and squidScore are required' });
    }

    const newAdmin = new Admin({
      teamName,
      squidScore
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json({ message: 'Admin entry created successfully', data: savedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all admin entries
router.get('/admin', async (req, res) => {
  try {
    const adminEntries = await Admin.find();
    res.status(200).json({ data: adminEntries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a specific admin entry by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const adminEntry = await Admin.findById(id);
    if (!adminEntry) {
      return res.status(404).json({ error: 'Admin entry not found' });
    }

    res.status(200).json({ data: adminEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update an admin entry by ID
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { teamName, squidScore } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { teamName, squidScore },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin entry not found' });
    }

    res.status(200).json({ message: 'Admin entry updated successfully', data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete an admin entry by ID
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin entry not found' });
    }

    res.status(200).json({ message: 'Admin entry deleted successfully', data: deletedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE SCORE - Update score by team name
router.patch('/admin/update-score/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({ error: 'score is required' });
    }

    const updatedTeam = await Admin.findOneAndUpdate(
      { teamName },
      { $inc: { squidScore: Number(score) } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({
      message: 'Score updated successfully',
      data: updatedTeam
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// INITIALIZE - Initialize all teams with zero scores
router.post('/admin/initialize', async (req, res) => {
  try {
    const teamNames = [
      "mugiwaras", "cerberus", "ackermans", "team spark", "radon", "akatsuki",
      "skibiddies", "black bulls", "404 found", "fraud fighters", "code smaserssss",
      "jill kews 67", "rocks", "machine masters", "dream builders", "unstop",
      "mind spark", "fab five", "ak spartans", "team pirates", "Stranger Things",
      "mind flayers", "team shouryanaga", "hack masters", "team 7", "team ace",
      "hitro", "code crafters", "cobra", "og", "power ranjers", "gladiators",
      "sparkers", "team dominant", "team titans", "falcon tech", "emperor's",
      "team jacob", "avengers", "mind skates", "tech army", "end zone",
      "team a2d", "think tank", "abcd", "vibe coders", "Techboo", "jai babu",
      "team hack", "blaze", "error 404", "alpha hackers", "kingpin", "spark",
      "jk warriors", "c champs", "loop legends", "SPIRIT", "sparks 2.0",
      "intelliminds", "elite"
    ];

    // Delete existing teams
    await Admin.deleteMany({});

    // Create new teams with score 0
    const teamsToInsert = teamNames.map(name => ({
      teamName: name,
      squidScore: 0
    }));

    const createdTeams = await Admin.insertMany(teamsToInsert);

    res.status(201).json({
      message: `Successfully initialized ${createdTeams.length} teams with zero scores`,
      data: createdTeams
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET TEAM BY NAME
router.get('/admin/name/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;

    const team = await Admin.findOne({ teamName: { $regex: teamName, $options: 'i' } });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({ data: team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RESET ALL SCORES TO ZERO
router.patch('/admin/reset-all', async (req, res) => {
  try {
    const result = await Admin.updateMany({}, { $set: { squidScore: 0 } });

    res.status(200).json({
      message: `Reset ${result.modifiedCount} teams to zero score`,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
