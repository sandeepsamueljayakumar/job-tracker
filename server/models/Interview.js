const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

class Interview {
  constructor(data) {
    this.jobId = data.jobId; // Reference to job
    this.type = data.type; // Phone, Technical, Onsite, Final
    this.scheduledDate = data.scheduledDate;
    this.duration = data.duration || 60; // in minutes
    this.interviewerName = data.interviewerName || "";
    this.interviewerTitle = data.interviewerTitle || "";
    this.interviewerEmail = data.interviewerEmail || "";
    this.location = data.location || "Remote"; // Remote, Onsite, or specific address
    this.meetingLink = data.meetingLink || "";
    this.questions = data.questions || []; // Array of questions asked
    this.notes = data.notes || "";
    this.feedback = data.feedback || "";
    this.result = data.result || "Pending"; // Pending, Passed, Failed
    this.prepNotes = data.prepNotes || "";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new interview
  static async create(interviewData) {
    const db = getDB();
    const interview = new Interview({
      ...interviewData,
      jobId: new ObjectId(interviewData.jobId)
    });
    const result = await db.collection("interviews").insertOne(interview);
    return { ...interview, _id: result.insertedId };
  }

  // Find all interviews
  static async findAll(filters = {}, sort = { scheduledDate: 1 }) {
    const db = getDB();
    const interviews = await db.collection("interviews")
      .find(filters)
      .sort(sort)
      .toArray();
    return interviews;
  }

  // Find interviews by job ID
  static async findByJobId(jobId) {
    const db = getDB();
    const interviews = await db.collection("interviews")
      .find({ jobId: new ObjectId(jobId) })
      .sort({ scheduledDate: 1 })
      .toArray();
    return interviews;
  }

  // Find interview by ID
  static async findById(id) {
    const db = getDB();
    const interview = await db.collection("interviews").findOne({ 
      _id: new ObjectId(id) 
    });
    return interview;
  }

  // Update an interview
  static async update(id, updates) {
    const db = getDB();
    updates.updatedAt = new Date();
    const result = await db.collection("interviews").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result;
  }

  // Delete an interview
  static async delete(id) {
    const db = getDB();
    const result = await db.collection("interviews").deleteOne({ 
      _id: new ObjectId(id) 
    });
    return result;
  }

  // Get upcoming interviews (next 7 days)
  static async getUpcoming() {
    const db = getDB();
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const interviews = await db.collection("interviews").aggregate([
      {
        $match: {
          scheduledDate: { $gte: now, $lte: nextWeek },
          result: "Pending"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      {
        $unwind: "$job"
      },
      {
        $sort: { scheduledDate: 1 }
      }
    ]).toArray();
    
    return interviews;
  }

  // Get interview statistics
  static async getStats() {
    const db = getDB();
    const stats = await db.collection("interviews").aggregate([
      {
        $group: {
          _id: {
            type: "$type",
            result: "$result"
          },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    return stats;
  }
}

module.exports = Interview;