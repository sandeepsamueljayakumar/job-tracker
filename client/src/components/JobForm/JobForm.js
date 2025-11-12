import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./JobForm.css";

const JobForm = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    jobUrl: "",
    description: "",
    salary: "",
    status: "Applied",
    appliedDate: new Date().toISOString().split("T")[0],
    resumeVersion: "default",
    notes: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    responseReceived: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || "",
        position: job.position || "",
        location: job.location || "",
        jobUrl: job.jobUrl || "",
        description: job.description || "",
        salary: job.salary || "",
        status: job.status || "Applied",
        appliedDate: job.appliedDate 
          ? new Date(job.appliedDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        resumeVersion: job.resumeVersion || "default",
        notes: job.notes || "",
        contactName: job.contactName || "",
        contactEmail: job.contactEmail || "",
        contactPhone: job.contactPhone || "",
        responseReceived: job.responseReceived || false,
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (formData.jobUrl && !isValidUrl(formData.jobUrl)) {
      newErrors.jobUrl = "Please enter a valid URL";
    }
    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }
    if (formData.contactPhone && !isValidPhone(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidPhone = (phone) => {
    const re = /^[\d\s\-\(\)\+]+$/;
    return re.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="job-form-container">
      <div className="job-form-header">
        <h2>{job ? "Edit Job Application" : "Add New Job Application"}</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <form className="job-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? "error" : ""}
              />
              {errors.company && <span className="error-message">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={errors.position ? "error" : ""}
              />
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? "error" : ""}
                placeholder="e.g., San Francisco, CA or Remote"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary Range</label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., $80k - $120k"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobUrl">Job URL</label>
            <input
              type="url"
              id="jobUrl"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className={errors.jobUrl ? "error" : ""}
              placeholder="https://..."
            />
            {errors.jobUrl && <span className="error-message">{errors.jobUrl}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Key responsibilities, requirements, etc."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Application Status</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Phone Screen">Phone Screen</option>
                <option value="Technical">Technical Interview</option>
                <option value="Onsite">Onsite Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appliedDate">Applied Date</label>
              <input
                type="date"
                id="appliedDate"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="resumeVersion">Resume Version</label>
              <select
                id="resumeVersion"
                name="resumeVersion"
                value={formData.resumeVersion}
                onChange={handleChange}
              >
                <option value="default">Default</option>
                <option value="frontend-focused">Frontend Focused</option>
                <option value="backend-focused">Backend Focused</option>
                <option value="fullstack">Full Stack</option>
                <option value="python-heavy">Python Heavy</option>
                <option value="java-heavy">Java Heavy</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="responseReceived"
                  checked={formData.responseReceived}
                  onChange={handleChange}
                />
                <span>Response Received</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactName">Contact Name</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Recruiter or hiring manager name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={errors.contactEmail ? "error" : ""}
                placeholder="contact@company.com"
              />
              {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactPhone">Contact Phone</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={errors.contactPhone ? "error" : ""}
              placeholder="555-123-4567"
            />
            {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Notes</h3>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Interview feedback, company culture, important details, etc."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            {job ? "Update Job" : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

JobForm.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string,
    company: PropTypes.string,
    position: PropTypes.string,
    location: PropTypes.string,
    jobUrl: PropTypes.string,
    description: PropTypes.string,
    salary: PropTypes.string,
    status: PropTypes.string,
    appliedDate: PropTypes.string,
    resumeVersion: PropTypes.string,
    notes: PropTypes.string,
    contactName: PropTypes.string,
    contactEmail: PropTypes.string,
    contactPhone: PropTypes.string,
    responseReceived: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default JobForm;