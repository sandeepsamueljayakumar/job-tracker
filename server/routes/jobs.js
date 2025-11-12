const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { ObjectId } = require("mongodb");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const { status, company, resumeVersion } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (company) filters.company = new RegExp(company, "i");
    if (resumeVersion) filters.resumeVersion = resumeVersion;
    
    const jobs = await Job.findAll(filters);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new job
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update job
router.put("/:id", async (req, res) => {
  try {
    const result = await Job.update(req.params.id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    const updatedJob = await Job.findById(req.params.id);
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE job
router.delete("/:id", async (req, res) => {
  try {
    const result = await Job.delete(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET job statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Job.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET jobs needing follow-up
router.get("/followup/needed", async (req, res) => {
  try {
    const jobs = await Job.findNeedingFollowUp();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;