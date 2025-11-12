import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./JobList.css";

const JobList = ({ jobs, onEdit, onDelete, onAdd }) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, statusFilter, sortBy]);

  const filterAndSortJobs = () => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.appliedDate) - new Date(a.appliedDate);
        case "date-asc":
          return new Date(a.appliedDate) - new Date(b.appliedDate);
        case "company":
          return a.company.localeCompare(b.company);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      "Applied": "#3498db",
      "Phone Screen": "#9b59b6",
      "Technical": "#e67e22",
      "Onsite": "#f39c12",
      "Offer": "#27ae60",
      "Rejected": "#e74c3c",
    };
    return colors[status] || "#95a5a6";
  };

  const getDaysSince = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h2>Job Applications ({filteredJobs.length})</h2>
        <button className="add-job-btn" onClick={onAdd}>
          + Add New Job
        </button>
      </div>

      <div className="job-list-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by company, position, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Phone Screen">Phone Screen</option>
          <option value="Technical">Technical</option>
          <option value="Onsite">Onsite</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="company">Company A-Z</option>
          <option value="status">Status</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs found matching your criteria.</p>
          <button className="add-job-btn" onClick={onAdd}>
            Add your first job application
          </button>
        </div>
      ) : (
        <div className="job-cards">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div className="job-title">
                  <h3>{job.company}</h3>
                  <p className="position">{job.position}</p>
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(job.status) }}
                >
                  {job.status}
                </span>
              </div>

              <div className="job-card-body">
                <div className="job-details">
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{job.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Applied:</span>
                    <span className="detail-value">
                      {formatDate(job.appliedDate)} 
                      <span className="days-ago">
                        ({getDaysSince(job.appliedDate)} days ago)
                      </span>
                    </span>
                  </div>
                  {job.salary && (
                    <div className="detail-item">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value">{job.salary}</span>
                    </div>
                  )}
                  {job.resumeVersion && (
                    <div className="detail-item">
                      <span className="detail-label">Resume:</span>
                      <span className="detail-value">{job.resumeVersion}</span>
                    </div>
                  )}
                </div>

                {job.notes && (
                  <div className="job-notes">
                    <p className="notes-label">Notes:</p>
                    <p className="notes-text">{job.notes}</p>
                  </div>
                )}

                {job.contactName && (
                  <div className="job-contact">
                    <p className="contact-label">Contact:</p>
                    <p className="contact-info">
                      {job.contactName}
                      {job.contactEmail && ` - ${job.contactEmail}`}
                      {job.contactPhone && ` - ${job.contactPhone}`}
                    </p>
                  </div>
                )}

                {!job.responseReceived && job.status === "Applied" && getDaysSince(job.appliedDate) > 7 && (
                  <div className="follow-up-alert">
                    ⚠️ No response for {getDaysSince(job.appliedDate)} days - Consider following up
                  </div>
                )}
              </div>

              <div className="job-card-footer">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEdit(job)}
                >
                  Edit
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDelete(job._id)}
                >
                  Delete
                </button>
                {job.jobUrl && (
                  <a 
                    href={job.jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-btn link-btn"
                  >
                    View Job
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

JobList.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      appliedDate: PropTypes.string.isRequired,
      salary: PropTypes.string,
      resumeVersion: PropTypes.string,
      notes: PropTypes.string,
      contactName: PropTypes.string,
      contactEmail: PropTypes.string,
      contactPhone: PropTypes.string,
      jobUrl: PropTypes.string,
      responseReceived: PropTypes.bool,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default JobList;