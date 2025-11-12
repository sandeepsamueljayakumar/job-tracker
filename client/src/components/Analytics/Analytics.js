import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Analytics.css";

const Analytics = ({ jobs }) => {
  const [analytics, setAnalytics] = useState({
    responseRate: 0,
    avgTimeToResponse: 0,
    successRate: 0,
    rejectionRate: 0,
    resumePerformance: [],
    monthlyApplications: [],
    topCompanies: [],
    statusDistribution: {},
  });

  useEffect(() => {
    calculateAnalytics();
  }, [jobs]);

  const calculateAnalytics = () => {
    if (jobs.length === 0) return;

    // Calculate response rate
    const responded = jobs.filter((job) => job.responseReceived).length;
    const responseRate = Math.round((responded / jobs.length) * 100);

    // Calculate average time to response
    const responseTimes = jobs
      .filter((job) => job.responseReceived && job.lastActivity)
      .map((job) => {
        const applied = new Date(job.appliedDate);
        const responded = new Date(job.lastActivity);
        return Math.ceil((responded - applied) / (1000 * 60 * 60 * 24));
      });
    const avgTimeToResponse = responseTimes.length
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    // Calculate success and rejection rates
    const offers = jobs.filter((job) => job.status === "Offer").length;
    const rejections = jobs.filter((job) => job.status === "Rejected").length;
    const successRate = Math.round((offers / jobs.length) * 100);
    const rejectionRate = Math.round((rejections / jobs.length) * 100);

    // Calculate resume performance
    const resumeStats = {};
    jobs.forEach((job) => {
      const version = job.resumeVersion || "default";
      if (!resumeStats[version]) {
        resumeStats[version] = { total: 0, responses: 0, offers: 0 };
      }
      resumeStats[version].total++;
      if (job.responseReceived) resumeStats[version].responses++;
      if (job.status === "Offer") resumeStats[version].offers++;
    });

    const resumePerformance = Object.entries(resumeStats).map(([version, stats]) => ({
      version,
      total: stats.total,
      responseRate: Math.round((stats.responses / stats.total) * 100),
      offerRate: Math.round((stats.offers / stats.total) * 100),
    }));

    // Calculate monthly applications
    const monthlyStats = {};
    jobs.forEach((job) => {
      const date = new Date(job.appliedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
    });

    const monthlyApplications = Object.entries(monthlyStats)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({ month, count }));

    // Calculate top companies
    const companyStats = {};
    jobs.forEach((job) => {
      companyStats[job.company] = (companyStats[job.company] || 0) + 1;
    });

    const topCompanies = Object.entries(companyStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));

    // Calculate status distribution
    const statusDistribution = {
      Applied: 0,
      "Phone Screen": 0,
      Technical: 0,
      Onsite: 0,
      Offer: 0,
      Rejected: 0,
    };

    jobs.forEach((job) => {
      if (statusDistribution.hasOwnProperty(job.status)) {
        statusDistribution[job.status]++;
      }
    });

    setAnalytics({
      responseRate,
      avgTimeToResponse,
      successRate,
      rejectionRate,
      resumePerformance,
      monthlyApplications,
      topCompanies,
      statusDistribution,
    });
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map((item) => item[key]));
  };

  const formatMonthName = (monthString) => {
    const [year, month] = monthString.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  return (
    <div className="analytics-container">
      <h2>Job Search Analytics</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Response Rate</div>
          <div className="metric-value">{analytics.responseRate}%</div>
          <div className="metric-description">
            {analytics.responseRate > 30 ? "Above average!" : "Keep applying!"}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Avg. Time to Response</div>
          <div className="metric-value">{analytics.avgTimeToResponse} days</div>
          <div className="metric-description">
            {analytics.avgTimeToResponse < 7 ? "Quick responses!" : "Patience is key"}
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-label">Success Rate</div>
          <div className="metric-value">{analytics.successRate}%</div>
          <div className="metric-description">Offer conversion rate</div>
        </div>

        <div className="metric-card danger">
          <div className="metric-label">Rejection Rate</div>
          <div className="metric-value">{analytics.rejectionRate}%</div>
          <div className="metric-description">Learning opportunities</div>
        </div>
      </div>

      <div className="analytics-sections">
        <div className="analytics-section">
          <h3>Resume Performance</h3>
          {analytics.resumePerformance.length === 0 ? (
            <p className="no-data">No resume data available</p>
          ) : (
            <div className="resume-performance">
              {analytics.resumePerformance.map((resume) => (
                <div key={resume.version} className="resume-stat">
                  <div className="resume-header">
                    <span className="resume-version">{resume.version}</span>
                    <span className="resume-count">{resume.total} applications</span>
                  </div>
                  <div className="resume-metrics">
                    <div className="resume-metric">
                      <span className="metric-label">Response Rate:</span>
                      <span className="metric-value">{resume.responseRate}%</span>
                    </div>
                    <div className="resume-metric">
                      <span className="metric-label">Offer Rate:</span>
                      <span className="metric-value">{resume.offerRate}%</span>
                    </div>
                  </div>
                  <div className="performance-bar">
                    <div
                      className="performance-fill"
                      style={{ width: `${resume.responseRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="analytics-section">
          <h3>Application Funnel</h3>
          <div className="funnel-chart">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => {
              const total = jobs.length || 1;
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={status} className="funnel-stage">
                  <div className="funnel-label">
                    {status} ({count})
                  </div>
                  <div className="funnel-bar-container">
                    <div
                      className="funnel-bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                    >
                      {percentage > 5 && `${percentage}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-section">
          <h3>Monthly Application Trend</h3>
          {analytics.monthlyApplications.length === 0 ? (
            <p className="no-data">No application data available</p>
          ) : (
            <div className="bar-chart">
              {analytics.monthlyApplications.map((month) => {
                const maxCount = getMaxValue(analytics.monthlyApplications, "count");
                const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                return (
                  <div key={month.month} className="bar-column">
                    <div className="bar-value">{month.count}</div>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="bar-label">
                      {formatMonthName(month.month)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="analytics-section">
          <h3>Top Applied Companies</h3>
          {analytics.topCompanies.length === 0 ? (
            <p className="no-data">No company data available</p>
          ) : (
            <div className="company-list">
              {analytics.topCompanies.map((company, index) => (
                <div key={company.company} className="company-item">
                  <span className="company-rank">#{index + 1}</span>
                  <span className="company-name">{company.company}</span>
                  <span className="company-count">{company.count} applications</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights">
          {analytics.responseRate > 40 && (
            <div className="insight positive">
              ✅ Your response rate is excellent! Your resume is catching attention.
            </div>
          )}
          {analytics.responseRate < 20 && (
            <div className="insight warning">
              ⚠️ Low response rate. Consider tailoring your resume for each application.
            </div>
          )}
          {analytics.avgTimeToResponse > 14 && (
            <div className="insight info">
              ℹ️ Companies are taking time to respond. Follow up after 7-10 days.
            </div>
          )}
          {analytics.resumePerformance.length > 1 && (
            <div className="insight info">
              ℹ️ Try analyzing which resume version performs best for different roles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

Analytics.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      company: PropTypes.string,
      position: PropTypes.string,
      status: PropTypes.string,
      appliedDate: PropTypes.string,
      lastActivity: PropTypes.string,
      responseReceived: PropTypes.bool,
      resumeVersion: PropTypes.string,
    })
  ).isRequired,
};

export default Analytics;