import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./InterviewCalendar.css";

const InterviewCalendar = ({ jobs }) => {
  const [interviews, setInterviews] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateMockInterviews();
  }, [jobs]);

  useEffect(() => {
    generateCalendarDays();
  }, [selectedMonth, interviews]);

  // Generate mock interviews from jobs data
  const generateMockInterviews = () => {
    const mockInterviews = [];
    
    jobs.forEach((job) => {
      if (["Phone Screen", "Technical", "Onsite"].includes(job.status)) {
        // Create a mock interview for jobs in interview stages
        const interviewDate = new Date();
        interviewDate.setDate(interviewDate.getDate() + Math.floor(Math.random() * 14)); // Random date in next 2 weeks
        
        mockInterviews.push({
          id: job._id + "-interview",
          jobId: job._id,
          company: job.company,
          position: job.position,
          type: job.status,
          date: interviewDate,
          time: `${9 + Math.floor(Math.random() * 8)}:00`, // Random time between 9 AM and 5 PM
          duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
          location: Math.random() > 0.5 ? "Remote" : job.location,
          notes: "Prepare STAR stories and review company values",
        });
      }
    });

    setInterviews(mockInterviews);
  };

  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayInterviews = interviews.filter((interview) => {
        return (
          interview.date.getDate() === day &&
          interview.date.getMonth() === month &&
          interview.date.getFullYear() === year
        );
      });
      
      days.push({
        date: day,
        interviews: dayInterviews,
        isToday: isToday(date),
      });
    }
    
    setCalendarDays(days);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      "Phone Screen": "#9b59b6",
      "Technical": "#e67e22",
      "Onsite": "#f39c12",
    };
    return colors[type] || "#3498db";
  };

  const formatMonth = () => {
    return selectedMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getUpcomingInterviews = () => {
    const now = new Date();
    const upcoming = interviews
      .filter((interview) => interview.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
    return upcoming;
  };

  const formatInterviewDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="interview-calendar">
      <h2>Interview Calendar</h2>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-btn" onClick={() => navigateMonth(-1)}>
            ‹
          </button>
          <h3>{formatMonth()}</h3>
          <button className="nav-btn" onClick={() => navigateMonth(1)}>
            ›
          </button>
        </div>
        
        <div className="calendar-grid">
          <div className="weekday-headers">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>
          
          <div className="calendar-days">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  day === null ? "empty" : ""
                } ${day?.isToday ? "today" : ""}`}
              >
                {day && (
                  <>
                    <div className="day-number">{day.date}</div>
                    <div className="day-interviews">
                      {day.interviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="interview-dot"
                          style={{
                            backgroundColor: getInterviewTypeColor(interview.type),
                          }}
                          title={`${interview.company} - ${interview.type} at ${interview.time}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="upcoming-interviews">
        <h3>Upcoming Interviews</h3>
        {getUpcomingInterviews().length === 0 ? (
          <p className="no-interviews">No upcoming interviews scheduled</p>
        ) : (
          <div className="interview-list">
            {getUpcomingInterviews().map((interview) => (
              <div key={interview.id} className="interview-item">
                <div
                  className="interview-type-indicator"
                  style={{
                    backgroundColor: getInterviewTypeColor(interview.type),
                  }}
                />
                <div className="interview-details">
                  <div className="interview-company">
                    <strong>{interview.company}</strong> - {interview.position}
                  </div>
                  <div className="interview-info">
                    <span className="interview-type">{interview.type}</span>
                    <span className="interview-datetime">
                      {formatInterviewDate(interview.date)} at {interview.time}
                    </span>
                    <span className="interview-duration">
                      {interview.duration} minutes
                    </span>
                  </div>
                  <div className="interview-location">
                    📍 {interview.location}
                  </div>
                  {interview.notes && (
                    <div className="interview-notes">
                      📝 {interview.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="calendar-legend">
        <h4>Interview Types</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: getInterviewTypeColor("Phone Screen") }}
            />
            Phone Screen
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: getInterviewTypeColor("Technical") }}
            />
            Technical
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: getInterviewTypeColor("Onsite") }}
            />
            Onsite
          </div>
        </div>
      </div>
    </div>
  );
};

InterviewCalendar.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      company: PropTypes.string,
      position: PropTypes.string,
      status: PropTypes.string,
      location: PropTypes.string,
    })
  ).isRequired,
};

export default InterviewCalendar;