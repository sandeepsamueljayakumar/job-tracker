# JobTracker Design Document

## Project Description

JobTracker is a comprehensive job application management system that solves the chaos of modern job searching. Most students and professionals juggle 50+ applications across spreadsheets, emails, and sticky notes, losing track of where they applied and when to follow up. JobTracker centralizes the entire job search process, providing intelligent tracking, automated reminders, and data-driven insights to turn job hunting from guesswork into strategic success.

### Key Features:
- **Application Tracking**: Track job applications through multiple stages
- **Interview Management**: Schedule and manage interviews with detailed notes
- **Smart Analytics**: Visualize success rates, response times, and resume performance
- **Follow-up Automation**: Get reminded when applications need follow-up
- **Calendar Integration**: See all upcoming interviews in one place

## User Personas

### 1. The Desperate New Grad - "Alex Chen"
**Age**: 22  
**Background**: Recent CS graduate from UC Berkeley  
**Tech Savviness**: High  
**Job Search Status**: Applying to 10+ jobs daily, 100+ total applications

**Goals**:
- Track all applications without missing any
- Know when to follow up without being annoying
- Maximize response rate

**Pain Points**:
- Loses track of where they applied
- Misses follow-up opportunities
- Can't remember which resume version was used

**Quote**: "I applied to so many places, I can't remember if I already applied to this company!"

### 2. The Strategic Switcher - "Maria Rodriguez"
**Age**: 28  
**Background**: Marketing professional transitioning to Product Management  
**Tech Savviness**: Medium  
**Job Search Status**: Selective applications, 20-30 targeted companies

**Goals**:
- Keep detailed notes about each company's culture
- Prepare targeted stories for each interview
- Track multiple interview processes simultaneously

**Pain Points**:
- Mixing up company details during interviews
- Forgetting specific requirements for each role
- Managing different timeline expectations

**Quote**: "I need to remember what each company values so I can tailor my responses perfectly."

### 3. The Multiple-Offer Senior - "James Park"
**Age**: 35  
**Background**: Senior Software Engineer with 10+ years experience  
**Tech Savviness**: Very High  
**Job Search Status**: Multiple active interview processes, expecting offers

**Goals**:
- Juggle multiple interview schedules
- Compare offers effectively
- Maintain professional relationships

**Pain Points**:
- Scheduling conflicts between interviews
- Keeping track of different compensation packages
- Remembering interviewer names and feedback

**Quote**: "I have 5 interviews next week and I need to keep each company's process straight."

## User Stories

### Epic 1: Application Management
1. **As Alex**, I want to quickly add new job applications, so I don't interrupt my application flow.
2. **As Maria**, I want to add detailed notes about company culture, so I can reference them during interviews.
3. **As James**, I want to update application status in real-time, so I always know my pipeline status.

### Epic 2: Follow-up Tracking
4. **As Alex**, I want automatic reminders after 7 days of no response, so I never miss follow-up opportunities.
5. **As Maria**, I want to mark when I've received responses, so I can track engagement rates.
6. **As James**, I want to set custom follow-up dates, so I can manage expectations with recruiters.

### Epic 3: Interview Management
7. **As Maria**, I want to log interview questions asked, so I can prepare better for future interviews.
8. **As James**, I want to see all upcoming interviews in a calendar view, so I can avoid scheduling conflicts.
9. **As Alex**, I want to store interviewer contact information, so I can send thank-you notes.

### Epic 4: Analytics & Insights
10. **As Alex**, I want to see my response rate by resume version, so I know which one works best.
11. **As Maria**, I want to track time-to-response metrics, so I can set realistic expectations.
12. **As James**, I want to see my interview conversion funnel, so I can identify weak points.

### Epic 5: Search & Filter
13. **As Alex**, I want to search applications by company name, so I can avoid duplicate applications.
14. **As Maria**, I want to filter by application status, so I can focus on active opportunities.
15. **As James**, I want to sort by date or status, so I can prioritize my efforts.

## Design Mockups

### 1. Dashboard View
```
┌─────────────────────────────────────────────────────────┐
│  JobTracker          [Dashboard][Jobs][Calendar][Analytics]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Overview Stats                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │   156    │ │    23    │ │    12    │ │     3    │ │
│  │  Total   │ │  Active  │ │  Offers  │ │ Rejected │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                          │
│  Application Pipeline                                   │
│  [Applied:89]→[Phone:34]→[Tech:23]→[Onsite:8]→[Offer:3]│
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Needs Follow-up │  │ Recent Activity │             │
│  │ • Google (8d)   │  │ • Meta - Offer  │             │
│  │ • Apple (10d)   │  │ • Uber - Tech   │             │
│  │ • Amazon (7d)   │  │ • Lyft - Phone  │             │
│  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### 2. Job List View
```
┌─────────────────────────────────────────────────────────┐
│  Job Applications (156)              [+ Add New Job]    │
├─────────────────────────────────────────────────────────┤
│  [Search...] [Status ▼] [Sort: Date ▼]                  │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐    │
│  │ Google - Software Engineer          [Technical] │    │
│  │ Mountain View, CA | Applied: Jan 15            │    │
│  │ Resume: frontend-focused | $150k-$200k         │    │
│  │ ⚠️ No response for 8 days - Follow up!        │    │
│  │ [Edit] [Delete] [View Job]                     │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Meta - Product Engineer              [Offer]    │    │
│  │ Menlo Park, CA | Applied: Jan 10               │    │
│  │ Resume: fullstack | $180k-$250k                 │    │
│  │ Contact: Jane Smith - jane@meta.com            │    │
│  │ [Edit] [Delete] [View Job]                     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 3. Job Form (Add/Edit)
```
┌─────────────────────────────────────────────────────────┐
│  Add New Job Application                           [X]  │
├─────────────────────────────────────────────────────────┤
│  Basic Information                                      │
│  Company*: [_______________] Position*: [_____________] │
│  Location*: [______________] Salary: [________________] │
│  Job URL: [________________________________________]    │
│                                                          │
│  Application Status                                     │
│  Status: [Applied ▼] Applied Date: [01/20/2024]        │
│  Resume Version: [Default ▼] □ Response Received       │
│                                                          │
│  Contact Information                                    │
│  Name: [_______________] Email: [____________________] │
│  Phone: [______________]                                │
│                                                          │
│  Notes                                                  │
│  [________________________________________________]     │
│  [________________________________________________]     │
│                                                          │
│              [Cancel]  [Save Application]               │
└─────────────────────────────────────────────────────────┘
```

### 4. Analytics View
```
┌─────────────────────────────────────────────────────────┐
│  Job Search Analytics                                   │
├─────────────────────────────────────────────────────────┤
│  Key Metrics                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │   35%    │ │  7 days  │ │   15%    │ │   12%    │ │
│  │ Response │ │ Avg Time │ │ Success  │ │ Rejection│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                          │
│  Resume Performance                                     │
│  Default:        [████████░░] 40% response             │
│  Frontend:       [██████░░░░] 30% response             │
│  Python-heavy:   [████████░░] 45% response             │
│                                                          │
│  Monthly Trend                                          │
│     40 │    ┌─┐                                        │
│     30 │ ┌─┐│ │  ┌─┐                                  │
│     20 │ │ ││ │  │ │  ┌─┐                             │
│     10 │ │ ││ │  │ │  │ │                             │
│        └─┴─┴┴─┴──┴─┴──┴─┴─                            │
│         Oct Nov  Dec  Jan                              │
└─────────────────────────────────────────────────────────┘
```

### 5. Interview Calendar View
```
┌─────────────────────────────────────────────────────────┐
│  Interview Calendar                                     │
├─────────────────────────────────────────────────────────┤
│         < January 2024 >                                │
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat                    │
│   14   15   16   17   18   19   20                    │
│        ●    ●●               ●                         │
│   21   22   23   24   25   26   27                    │
│   ●          ●    ●●   ●                              │
│                                                          │
│  Upcoming Interviews                                    │
│  ┌────────────────────────────────────────────────┐   │
│  │ Jan 22 - Google - Technical Interview          │   │
│  │ 2:00 PM | 60 min | Remote                     │   │
│  │ Notes: Review system design, STAR stories      │   │
│  └────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────┐   │
│  │ Jan 24 - Meta - Onsite Interview              │   │
│  │ 10:00 AM | 4 hours | Menlo Park, CA          │   │
│  │ Notes: 4 rounds - coding, system, behavioral   │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Technical Architecture

### Frontend Architecture
- **React 18** with functional components and hooks
- **Component Structure**: 
  - App (Main container)
  - Dashboard (Overview stats)
  - JobList (Application management)
  - JobForm (Add/Edit jobs)
  - InterviewCalendar (Interview scheduling)
  - Analytics (Data insights)

### Backend Architecture
- **Node.js + Express** REST API
- **MongoDB** for data persistence
- **Collections**:
  - Jobs (1000+ records)
  - Interviews (300+ records)

### Data Flow
1. User interacts with React components
2. Components call API service functions
3. API routes handle requests
4. Models interact with MongoDB
5. Data returned and state updated
6. UI re-renders with new data

## Implementation Plan

### Phase 1: Setup & Core Infrastructure
- Project setup and configuration
- Database models and connection
- Basic Express server
- React app initialization

### Phase 2: CRUD Operations
- Job model and routes
- Interview model and routes
- API service layer
- Form components

### Phase 3: User Interface
- Dashboard component
- Job list with filters
- Interview calendar
- Analytics visualizations

### Phase 4: Advanced Features
- Follow-up reminders
- Resume performance tracking
- Data seeding script
- Responsive design

### Phase 5: Polish & Deploy
- Error handling
- Loading states
- Testing
- Deployment setup

## Success Metrics
- All CRUD operations functional
- 1000+ synthetic records seeded
- Responsive design on all devices
- ESLint passes with no errors
- Proper component organization
- Clean, formatted code