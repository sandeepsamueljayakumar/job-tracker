const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "../.env" });

// Sample data for generation
const companies = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla", "Uber", "Airbnb", "Spotify",
  "Salesforce", "Adobe", "Oracle", "IBM", "Intel", "Nvidia", "PayPal", "Square", "Stripe", "Twilio",
  "Slack", "Zoom", "Dropbox", "Twitter", "LinkedIn", "Pinterest", "Snapchat", "Reddit", "GitHub", "GitLab"
];

const positions = [
  "Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", 
  "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Machine Learning Engineer",
  "Product Manager", "Technical Program Manager", "QA Engineer", "Mobile Developer",
  "Cloud Architect", "Security Engineer", "Site Reliability Engineer"
];

const locations = [
  "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA",
  "Los Angeles, CA", "Chicago, IL", "Denver, CO", "Portland, OR", "Remote",
  "San Jose, CA", "Washington, DC", "Atlanta, GA", "Miami, FL", "Dallas, TX"
];

const statuses = ["Applied", "Phone Screen", "Technical", "Onsite", "Offer", "Rejected"];
const resumeVersions = ["default", "frontend-focused", "backend-focused", "fullstack", "python-heavy", "java-heavy"];
const interviewTypes = ["Phone", "Technical", "Onsite", "Final"];
const interviewResults = ["Pending", "Passed", "Failed"];

// Helper function to get random element from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate random date within last 3 months
const getRandomDate = (daysBack = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

// Generate sample questions
const sampleQuestions = [
  "Tell me about yourself",
  "Why do you want to work here?",
  "Describe a challenging project",
  "How do you handle conflicts?",
  "Where do you see yourself in 5 years?",
  "Reverse a linked list",
  "Implement a binary search",
  "Design a URL shortener",
  "Explain REST vs GraphQL",
  "What is your biggest weakness?",
  "Describe your experience with cloud technologies",
  "How would you optimize a slow database query?",
  "Explain the difference between SQL and NoSQL",
  "Design a parking lot system",
  "Implement a LRU cache"
];

// Main seeding function
async function seedDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/jobtracker";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB for seeding");

    const db = client.db("jobtracker");
    
    // Clear existing data
    await db.collection("jobs").deleteMany({});
    await db.collection("interviews").deleteMany({});
    console.log("Cleared existing data");

    const jobs = [];
    const interviews = [];

    // Generate 1000 job applications
    for (let i = 0; i < 1000; i++) {
      const appliedDate = getRandomDate();
      const status = getRandom(statuses);
      const responseReceived = status !== "Applied" || Math.random() > 0.7;
      
      const job = {
        company: getRandom(companies),
        position: getRandom(positions),
        location: getRandom(locations),
        jobUrl: `https://example.com/jobs/${i}`,
        description: `Exciting opportunity for a ${getRandom(positions)} to join our team and work on cutting-edge projects.`,
        salary: `$${80 + Math.floor(Math.random() * 120)}k - $${150 + Math.floor(Math.random() * 150)}k`,
        status: status,
        appliedDate: appliedDate,
        lastActivity: responseReceived ? getRandomDate(60) : appliedDate,
        resumeVersion: getRandom(resumeVersions),
        notes: Math.random() > 0.5 ? "Great company culture, interesting tech stack" : "",
        contactName: Math.random() > 0.3 ? `Recruiter ${i}` : "",
        contactEmail: Math.random() > 0.3 ? `recruiter${i}@example.com` : "",
        contactPhone: Math.random() > 0.5 ? `555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}` : "",
        followUpDate: Math.random() > 0.6 ? getRandomDate(30) : null,
        responseReceived: responseReceived,
        createdAt: appliedDate,
        updatedAt: new Date()
      };

      jobs.push(job);
    }

    // Insert jobs
    const insertedJobs = await db.collection("jobs").insertMany(jobs);
    console.log(`Inserted ${insertedJobs.insertedCount} jobs`);

    // Generate interviews for some jobs (about 30% of jobs have interviews)
    const jobIds = Object.values(insertedJobs.insertedIds);
    const jobsWithInterviews = jobIds.slice(0, Math.floor(jobIds.length * 0.3));

    for (const jobId of jobsWithInterviews) {
      const numInterviews = Math.floor(Math.random() * 4) + 1; // 1-4 interviews per job
      
      for (let j = 0; j < numInterviews; j++) {
        const scheduledDate = getRandomDate(60);
        const interview = {
          jobId: jobId,
          type: interviewTypes[Math.min(j, interviewTypes.length - 1)],
          scheduledDate: scheduledDate,
          duration: [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)],
          interviewerName: `Interviewer ${Math.floor(Math.random() * 1000)}`,
          interviewerTitle: getRandom(["Engineering Manager", "Senior Engineer", "Tech Lead", "Director", "VP Engineering"]),
          interviewerEmail: `interviewer${Math.floor(Math.random() * 1000)}@example.com`,
          location: Math.random() > 0.5 ? "Remote" : getRandom(locations),
          meetingLink: Math.random() > 0.3 ? `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}` : "",
          questions: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => getRandom(sampleQuestions)),
          notes: Math.random() > 0.5 ? "Interview went well, good rapport with interviewer" : "",
          feedback: Math.random() > 0.7 ? "Strong candidate, recommend moving forward" : "",
          result: scheduledDate < new Date() ? getRandom(interviewResults) : "Pending",
          prepNotes: Math.random() > 0.4 ? "Review STAR stories, practice system design" : "",
          createdAt: scheduledDate,
          updatedAt: new Date()
        };

        interviews.push(interview);
      }
    }

    // Insert interviews
    if (interviews.length > 0) {
      const insertedInterviews = await db.collection("interviews").insertMany(interviews);
      console.log(`Inserted ${insertedInterviews.insertedCount} interviews`);
    }

    // Create indexes for better performance
    await db.collection("jobs").createIndex({ status: 1 });
    await db.collection("jobs").createIndex({ company: 1 });
    await db.collection("jobs").createIndex({ appliedDate: -1 });
    await db.collection("interviews").createIndex({ jobId: 1 });
    await db.collection("interviews").createIndex({ scheduledDate: 1 });
    
    console.log("Created indexes");
    console.log("Database seeding completed successfully!");

    // Print some statistics
    const jobStats = await db.collection("jobs").aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();
    
    console.log("\nJob Statistics:");
    jobStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// Run the seeding script
seedDatabase();