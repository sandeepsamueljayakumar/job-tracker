const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const { ObjectId } = require("mongodb");

// GET all interviews
router.get("/", async (req, res) => {
  try {
    const { jobId, type, result } = req.query;
    const filters = {};
    
    if (jobId) filters.jobId = new ObjectId(jobId);
    if (type) filters.type = type;
    if (result) filters.result = result;
    
    const interviews = await Interview.findAll(filters);
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single interview by ID
router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET interviews by job ID
router.get("/job/:jobId", async (req, res) => {
  try {
    const interviews = await Interview.findByJobId(req.params.jobId);
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new interview
router.post("/", async (req, res) => {
  try {
    const interview = await Interview.create(req.body);
    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update interview
router.put("/:id", async (req, res) => {
  try {
    const result = await Interview.update(req.params.id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }
    const updatedInterview = await Interview.findById(req.params.id);
    res.json(updatedInterview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE interview
router.delete("/:id", async (req, res) => {
  try {
    const result = await Interview.delete(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }
    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET upcoming interviews
router.get("/calendar/upcoming", async (req, res) => {
  try {
    const interviews = await Interview.getUpcoming();
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET interview statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Interview.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;