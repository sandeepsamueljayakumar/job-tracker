import React, { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import JobList from "./components/JobList/JobList";
import JobForm from "./components/JobForm/JobForm";
import InterviewCalendar from "./components/InterviewCalendar/InterviewCalendar";
import Analytics from "./components/Analytics/Analytics";
import { getJobs, createJob, updateJob, deleteJob } from "./services/api";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      const newJob = await createJob(jobData);
      setJobs([newJob, ...jobs]);
      setShowJobForm(false);
      setSelectedJob(null);
    } catch (err) {
      setError("Failed to create job. Please try again.");
      console.error("Error creating job:", err);
    }
  };

  const handleUpdateJob = async (id, jobData) => {
    try {
      const updatedJob = await updateJob(id, jobData);
      setJobs(jobs.map((job) => (job._id === id ? updatedJob : job)));
      setShowJobForm(false);
      setSelectedJob(null);
    } catch (err) {
      setError("Failed to update job. Please try again.");
      console.error("Error updating job:", err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job application?")) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        setError("Failed to delete job. Please try again.");
        console.error("Error deleting job:", err);
      }
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobForm(true);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    switch (activeView) {
      case "dashboard":
        return <Dashboard jobs={jobs} />;
      case "jobs":
        return (
          <JobList
            jobs={jobs}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
            onAdd={() => setShowJobForm(true)}
          />
        );
      case "calendar":
        return <InterviewCalendar jobs={jobs} />;
      case "analytics":
        return <Analytics jobs={jobs} />;
      default:
        return <Dashboard jobs={jobs} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>JobTracker</h1>
        <p className="tagline">Smart Job Application Management System</p>
      </header>

      <nav className="App-nav">
        <button
          className={activeView === "dashboard" ? "active" : ""}
          onClick={() => setActiveView("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeView === "jobs" ? "active" : ""}
          onClick={() => setActiveView("jobs")}
        >
          Jobs
        </button>
        <button
          className={activeView === "calendar" ? "active" : ""}
          onClick={() => setActiveView("calendar")}
        >
          Calendar
        </button>
        <button
          className={activeView === "analytics" ? "active" : ""}
          onClick={() => setActiveView("analytics")}
        >
          Analytics
        </button>
      </nav>

      <main className="App-main">
        {showJobForm && (
          <JobForm
            job={selectedJob}
            onSave={selectedJob ? 
              (data) => handleUpdateJob(selectedJob._id, data) : 
              handleCreateJob
            }
            onCancel={() => {
              setShowJobForm(false);
              setSelectedJob(null);
            }}
          />
        )}
        {!showJobForm && renderContent()}
      </main>

      <footer className="App-footer">
        <p>© 2025 Job Tracker - Made by Sandeep Samuel Jayakumar</p>
      </footer>
    </div>
  );
}

export default App;