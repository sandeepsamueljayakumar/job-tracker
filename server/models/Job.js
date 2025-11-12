const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

class Job {
  constructor(data) {
    this.company = data.company;
    this.position = data.position;
    this.location = data.location;
    this.jobUrl = data.jobUrl || "";
    this.description = data.description || "";
    this.salary = data.salary || "";
    this.status = data.status || "Applied"; // Applied, Phone Screen, Technical, Onsite, Offer, Rejected
    this.appliedDate = data.appliedDate || new Date();
    this.lastActivity = data.lastActivity || new Date();
    this.resumeVersion = data.resumeVersion || "default";
    this.notes = data.notes || "";
    this.contactName = data.contactName || "";
    this.contactEmail = data.contactEmail || "";
    this.contactPhone = data.contactPhone || "";
    this.followUpDate = data.followUpDate || null;
    this.responseReceived = data.responseReceived || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new job
  static async create(jobData) {
    const db = getDB();
    const job = new Job(jobData);
    const result = await db.collection("jobs").insertOne(job);
    return { ...job, _id: result.insertedId };
  }

  // Find all jobs with optional filters
  static async findAll(filters = {}, sort = { appliedDate: -1 }) {
    const db = getDB();
    const jobs = await db.collection("jobs")
      .find(filters)
      .sort(sort)
      .toArray();
    return jobs;
  }

  // Find a job by ID
  static async findById(id) {
    const db = getDB();
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });
    return job;
  }

  // Update a job
  static async update(id, updates) {
    const db = getDB();
    updates.updatedAt = new Date();
    const result = await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result;
  }

  // Delete a job
  static async delete(id) {
    const db = getDB();
    const result = await db.collection("jobs").deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  // Get statistics
  static async getStats() {
    const db = getDB();
    const stats = await db.collection("jobs").aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const resumeStats = await db.collection("jobs").aggregate([
      {
        $match: { responseReceived: true }
      },
      {
        $group: {
          _id: "$resumeVersion",
          total: { $sum: 1 },
          responses: { $sum: { $cond: ["$responseReceived", 1, 0] } }
        }
      }
    ]).toArray();

    return { statusStats: stats, resumeStats };
  }

  // Find jobs needing follow-up
  static async findNeedingFollowUp() {
    const db = getDB();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const jobs = await db.collection("jobs").find({
      status: "Applied",
      responseReceived: false,
      appliedDate: { $lte: sevenDaysAgo }
    }).toArray();
    
    return jobs;
  }
}

module.exports = Job;