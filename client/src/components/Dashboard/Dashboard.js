import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

const Dashboard = ({ jobs }) => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    phoneScreen: 0,
    technical: 0,
    onsite: 0,
    offer: 0,
    rejected: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [needsFollowUp, setNeedsFollowUp] = useState([]);

  useEffect(() => {
    calculateStats();
    findRecentActivity();
    findNeedsFollowUp();
  }, [jobs]);

  const calculateStats = () => {
    const newStats = {
      total: jobs.length,
      applied: 0,
      phoneScreen: 0,
      technical: 0,
      onsite: 0,
      offer: 0,
      rejected: 0,
    };

    jobs.forEach((job) => {
      switch (job.status) {
        case "Applied":
          newStats.applied++;
          break;
        case "Phone Screen":
          newStats.phoneScreen++;
          break;
        case "Technical":
          newStats.technical++;
          break;
        case "Onsite":
          newStats.onsite++;
          break;
        case "Offer":
          newStats.offer++;
          break;
        case "Rejected":
          newStats.rejected++;
          break;
        default:
          break;
      }
    });

    setStats(newStats);
  };

  const findRecentActivity = () => {
    const sortedJobs = [...jobs].sort(
      (a, b) =>
        new Date(b.lastActivity || b.appliedDate) -
        new Date(a.lastActivity || a.appliedDate)
    );
    setRecentActivity(sortedJobs.slice(0, 5));
  };

  const findNeedsFollowUp = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const followUpJobs = jobs.filter((job) => {
      return (
        job.status === "Applied" &&
        !job.responseReceived &&
        new Date(job.appliedDate) <= sevenDaysAgo
      );
    });

    setNeedsFollowUp(followUpJobs);
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: "#3498db",
      "Phone Screen": "#9b59b6",
      Technical: "#e67e22",
      Onsite: "#f39c12",
      Offer: "#27ae60",
      Rejected: "#e74c3c",
    };
    return colors[status] || "#95a5a6";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysSince = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Active Pipeline</h3>
          <div className="stat-number">
            {stats.phoneScreen + stats.technical + stats.onsite}
          </div>
        </div>
        <div className="stat-card success">
          <h3>Offers</h3>
          <div className="stat-number">{stats.offer}</div>
        </div>
        <div className="stat-card danger">
          <h3>Rejected</h3>
          <div className="stat-number">{stats.rejected}</div>
        </div>
      </div>

      <div className="pipeline-overview">
        <h3>Application Pipeline</h3>
        <div className="pipeline-stages">
          <div className="stage" style={{ flex: stats.applied || 1 }}>
            <div
              className="stage-bar"
              style={{ backgroundColor: getStatusColor("Applied") }}
            >
              <span className="stage-label">Applied</span>
              <span className="stage-count">{stats.applied}</span>
            </div>
          </div>
          <div className="stage" style={{ flex: stats.phoneScreen || 1 }}>
            <div
              className="stage-bar"
              style={{ backgroundColor: getStatusColor("Phone Screen") }}
            >
              <span className="stage-label">Phone</span>
              <span className="stage-count">{stats.phoneScreen}</span>
            </div>
          </div>
          <div className="stage" style={{ flex: stats.technical || 1 }}>
            <div
              className="stage-bar"
              style={{ backgroundColor: getStatusColor("Technical") }}
            >
              <span className="stage-label">Technical</span>
              <span className="stage-count">{stats.technical}</span>
            </div>
          </div>
          <div className="stage" style={{ flex: stats.onsite || 1 }}>
            <div
              className="stage-bar"
              style={{ backgroundColor: getStatusColor("Onsite") }}
            >
              <span className="stage-label">Onsite</span>
              <span className="stage-count">{stats.onsite}</span>
            </div>
          </div>
          <div className="stage" style={{ flex: stats.offer || 1 }}>
            <div
              className="stage-bar"
              style={{ backgroundColor: getStatusColor("Offer") }}
            >
              <span className="stage-label">Offer</span>
              <span className="stage-count">{stats.offer}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section follow-up-section">
          <h3>Needs Follow-Up ({needsFollowUp.length})</h3>
          {needsFollowUp.length === 0 ? (
            <p className="no-data">No applications need follow-up</p>
          ) : (
            <ul className="job-list">
              {needsFollowUp.map((job) => (
                <li key={job._id} className="job-item">
                  <div className="job-info">
                    <strong>{job.company}</strong> - {job.position}
                    <span className="days-ago">
                      {getDaysSince(job.appliedDate)} days ago
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="section recent-activity-section">
          <h3>Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="no-data">No recent activity</p>
          ) : (
            <ul className="job-list">
              {recentActivity.map((job) => (
                <li key={job._id} className="job-item">
                  <div className="job-info">
                    <strong>{job.company}</strong> - {job.position}
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(job.status) }}
                    >
                      {job.status}
                    </span>
                    <span className="date">
                      {formatDate(job.lastActivity || job.appliedDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <h4>Response Rate</h4>
          <div className="stat-value">
            {stats.total > 0
              ? Math.round(((stats.total - stats.applied) / stats.total) * 100)
              : 0}
            %
          </div>
        </div>
        <div className="quick-stat">
          <h4>Interview Rate</h4>
          <div className="stat-value">
            {stats.total > 0
              ? Math.round(
                  ((stats.phoneScreen + stats.technical + stats.onsite) /
                    stats.total) *
                    100
                )
              : 0}
            %
          </div>
        </div>
        <div className="quick-stat">
          <h4>Success Rate</h4>
          <div className="stat-value">
            {stats.total > 0
              ? Math.round((stats.offer / stats.total) * 100)
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      company: PropTypes.string,
      position: PropTypes.string,
      status: PropTypes.string,
      appliedDate: PropTypes.string,
      lastActivity: PropTypes.string,
      responseReceived: PropTypes.bool,
    })
  ).isRequired,
};

export default Dashboard;
