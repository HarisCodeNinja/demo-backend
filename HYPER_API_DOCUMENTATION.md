# HYPER Agentic Layer API Documentation

## Overview

The HYPER (Highly Efficient Personnel Resource Engine) layer provides MCP-like intelligent APIs that reduce manual HR operations through automated monitoring, analytics, and insights.

**Vision:** Reduce manual labour through an intelligent internal software layer

## Architecture

The HYPER layer consists of 4 intelligent modules with **27 specialized endpoints**:

1. **Employee Lifecycle Monitor** (7 endpoints) - `/hyper/employee-lifecycle/`
2. **Recruitment Intelligence** (6 endpoints) - `/hyper/recruitment/`
3. **Attendance Insights** (6 endpoints) - `/hyper/attendance/`
4. **Conversational Dashboard** (8 endpoints) - `/hyper/dashboard/`

---

## Authentication

All HYPER endpoints require JWT authentication:

```http
Authorization: Bearer <access_token>
```

Role-based access control is enforced on all endpoints.

---

## 1. Employee Lifecycle Monitor

**Purpose:** Automate tracking and management of employee lifecycle data

### 1.1 Get Employees with Missing Documents

**Endpoint:** `GET /hyper/employee-lifecycle/missing-documents`

**Access:** Manager, HR, Admin

**Query Parameters:**
- `departmentId` (optional): Filter by department UUID
- `days` (optional): Number of days to look back
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response Example:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "John Doe",
      "department": "Engineering",
      "missingDocuments": [
        "ID Card/Passport",
        "Bank Account Details"
      ],
      "daysOverdue": 45
    }
  ],
  "meta": {
    "total": 12,
    "message": "Found 12 employees with missing documents"
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Show me all employees with missing documents"
const response = await fetch('/hyper/employee-lifecycle/missing-documents', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
// Display: "Found 12 employees with missing documents..."
```

### 1.2 Get Incomplete Onboarding

**Endpoint:** `GET /hyper/employee-lifecycle/incomplete-onboarding`

**Access:** Manager, HR, Admin

**Query Parameters:**
- `days` (optional, default: 30): Days since joining
- `limit`, `offset`

**Response Example:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "Jane Smith",
      "joinDate": "2025-10-15T00:00:00.000Z",
      "daysDelayed": 23,
      "completionPercentage": 60,
      "pendingItems": [
        "Configure salary structure",
        "Assign reporting manager"
      ]
    }
  ],
  "meta": {
    "total": 5,
    "message": "Found 5 employees with incomplete onboarding"
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Who hasn't completed onboarding yet?"
const response = await fetch('/hyper/employee-lifecycle/incomplete-onboarding', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 1.3 Get Department Changes

**Endpoint:** `GET /hyper/employee-lifecycle/department-changes`

**Access:** Manager, HR, Admin

### 1.4 Get Role Mismatches

**Endpoint:** `GET /hyper/employee-lifecycle/role-mismatches`

**Access:** HR, Admin

**Response Example:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "Bob Johnson",
      "hrmRole": "Senior Developer",
      "payrollRole": "Missing",
      "department": "Engineering",
      "issueType": "salary_structure_missing"
    }
  ],
  "meta": {
    "total": 3,
    "message": "Found 3 role/data mismatches"
  }
}
```

### 1.5 Get Pending Verifications

**Endpoint:** `GET /hyper/employee-lifecycle/pending-verifications`

### 1.6 Get New Hires Summary

**Endpoint:** `GET /hyper/employee-lifecycle/new-hires-summary`

**Query Parameters:**
- `startDate`, `endDate`: Date range
- `departmentId`, `onboardingStatus`

**Response Example:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "Alice Brown",
      "designation": "Software Engineer",
      "department": "Engineering",
      "joinDate": "2025-10-01T00:00:00.000Z",
      "daysWithCompany": 37,
      "onboardingStatus": "in_progress",
      "assignedMentor": "John Doe"
    }
  ],
  "meta": {
    "total": 8,
    "message": "Found 8 new hires",
    "summary": {
      "notStarted": 2,
      "inProgress": 4,
      "completed": 2
    }
  }
}
```

### 1.7 Get Offboarding Checklist

**Endpoint:** `GET /hyper/employee-lifecycle/offboarding-checklist`

---

## 2. Recruitment Intelligence

**Purpose:** Automate candidate management and recruitment analytics

### 2.1 Get Interviews Pending Feedback

**Endpoint:** `GET /hyper/recruitment/pending-feedback`

**Access:** HR, Admin

**Response Example:**
```json
{
  "data": [
    {
      "interviewId": "uuid",
      "candidateName": "Sarah Williams",
      "jobTitle": "Frontend Developer",
      "interviewerName": "Mike Manager",
      "interviewDate": "2025-11-05T14:00:00.000Z",
      "daysPending": 2,
      "interviewRound": "Round 2"
    }
  ],
  "meta": {
    "total": 7,
    "message": "Found 7 interviews pending feedback"
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Show all candidates waiting for interview feedback"
const response = await fetch('/hyper/recruitment/pending-feedback', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 2.2 Get Candidate Matching

**Endpoint:** `GET /hyper/recruitment/candidate-matching/:jobOpeningId`

**Access:** HR, Admin

**Query Parameters:**
- `minMatchScore` (optional, default: 0): Minimum match percentage
- `limit`, `offset`

**Response Example:**
```json
{
  "data": [
    {
      "candidateId": "uuid",
      "candidateName": "David Lee",
      "email": "david@example.com",
      "phone": "+1234567890",
      "matchScore": 85,
      "matchingSkills": ["React", "TypeScript", "Node.js"],
      "missingSkills": ["GraphQL"],
      "experienceYears": 5,
      "currentStage": "Interview",
      "appliedDate": "2025-10-20T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "message": "Found 15 matching candidates",
    "jobTitle": "Frontend Developer",
    "requiredSkills": ["React", "TypeScript", "Node.js", "GraphQL"]
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Who's best matched for the 'Frontend Developer' role?"
const jobId = "job-opening-uuid";
const response = await fetch(`/hyper/recruitment/candidate-matching/${jobId}?minMatchScore=70`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 2.3 Get Hiring Funnel

**Endpoint:** `GET /hyper/recruitment/hiring-funnel`

**Query Parameters:**
- `startDate`, `endDate`: Date range
- `jobOpeningId`, `departmentId`: Filters

**Response Example:**
```json
{
  "data": [
    {
      "stage": "Applied",
      "count": 120,
      "percentage": 100,
      "avgDaysInStage": 0
    },
    {
      "stage": "Screening",
      "count": 45,
      "percentage": 37.5,
      "avgDaysInStage": 0
    },
    {
      "stage": "Interview",
      "count": 25,
      "percentage": 20.8,
      "avgDaysInStage": 0
    },
    {
      "stage": "Offered",
      "count": 8,
      "percentage": 6.7,
      "avgDaysInStage": 0
    },
    {
      "stage": "Hired",
      "count": 5,
      "percentage": 4.2,
      "avgDaysInStage": 0
    }
  ],
  "meta": {
    "total": 120,
    "message": "Hiring funnel for 120 candidates"
  }
}
```

### 2.4 Get Pipeline Summary

**Endpoint:** `GET /hyper/recruitment/pipeline-summary`

**Response Example:**
```json
{
  "data": [
    {
      "jobOpeningId": "uuid",
      "jobTitle": "Senior Backend Developer",
      "department": "Engineering",
      "totalApplicants": 45,
      "newApplications": 8,
      "shortlisted": 12,
      "interviewing": 6,
      "offered": 2,
      "hired": 1,
      "rejected": 15,
      "daysOpen": 42,
      "recruiters": []
    }
  ],
  "meta": {
    "total": 5,
    "message": "Found 5 active job openings"
  }
}
```

### 2.5 Get Overdue Interviews

**Endpoint:** `GET /hyper/recruitment/overdue-interviews`

### 2.6 Get Recruiter Performance

**Endpoint:** `GET /hyper/recruitment/recruiter-performance`

---

## 3. Attendance Insights

**Purpose:** Automate attendance monitoring and anomaly detection

### 3.1 Get Today's Summary

**Endpoint:** `GET /hyper/attendance/today-summary`

**Access:** Manager, HR, Admin

**Query Parameters:**
- `date` (optional): Target date (defaults to today)
- `departmentId` (optional)

**Response Example:**
```json
{
  "data": {
    "date": "2025-11-07T00:00:00.000Z",
    "totalEmployees": 150,
    "present": 135,
    "absent": 10,
    "late": 15,
    "onLeave": 5,
    "attendancePercentage": 90,
    "departments": [
      {
        "departmentName": "Engineering",
        "present": 45,
        "total": 50,
        "percentage": 90
      },
      {
        "departmentName": "Sales",
        "present": 28,
        "total": 30,
        "percentage": 93.3
      }
    ]
  },
  "meta": {
    "message": "Attendance summary for Thu Nov 07 2025"
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Give me today's attendance summary"
const response = await fetch('/hyper/attendance/today-summary', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 3.2 Get Absentee Patterns

**Endpoint:** `GET /hyper/attendance/absentee-patterns`

**Query Parameters:**
- `startDate`, `endDate`: Date range
- `minAbsences` (default: 3): Minimum absences to flag
- `departmentId`

**Response Example:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "Tom Wilson",
      "department": "Sales",
      "totalAbsences": 8,
      "consecutiveAbsences": 0,
      "absentDates": [],
      "pattern": "frequent"
    }
  ],
  "meta": {
    "total": 4,
    "message": "Found 4 employees with absentee patterns"
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Who's been absent more than 3 times this week?"
const oneWeekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString();
const today = new Date().toISOString();
const response = await fetch(
  `/hyper/attendance/absentee-patterns?startDate=${oneWeekAgo}&endDate=${today}&minAbsences=3`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

### 3.3 Get Late Comers

**Endpoint:** `GET /hyper/attendance/late-comers`

**Query Parameters:**
- `date`: Target date
- `minLateMinutes` (default: 15)
- `departmentId`

**Response Example:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "Emma Davis",
      "department": "Marketing",
      "manager": "Sarah Manager",
      "date": "2025-11-07T00:00:00.000Z",
      "scheduledTime": "09:00 AM",
      "checkInTime": "9:25:30 AM",
      "minutesLate": 25,
      "lateCount7Days": 3,
      "lateCount30Days": 8
    }
  ],
  "meta": {
    "total": 12,
    "message": "Found 12 late comers"
  }
}
```

### 3.4 Get Anomaly Detection

**Endpoint:** `GET /hyper/attendance/anomaly-detection`

**Response Example:**
```json
{
  "data": [
    {
      "type": "missing_checkout",
      "employeeId": "uuid",
      "employeeName": "Chris Martin",
      "department": "Engineering",
      "date": "2025-11-06T00:00:00.000Z",
      "details": "Check-in at 9:00:00 AM, no check-out recorded",
      "severity": "medium"
    },
    {
      "type": "unusual_hours",
      "employeeId": "uuid",
      "employeeName": "Lisa Anderson",
      "department": "Operations",
      "date": "2025-11-05T00:00:00.000Z",
      "details": "Worked 14.5 hours",
      "severity": "high"
    }
  ],
  "meta": {
    "total": 25,
    "message": "Found 25 attendance anomalies"
  }
}
```

### 3.5 Get Team Attendance

**Endpoint:** `GET /hyper/attendance/team-attendance/:managerId`

**Response Example:**
```json
{
  "data": {
    "managerId": "uuid",
    "managerName": "John Manager",
    "teamSize": 15,
    "presentToday": 13,
    "absentToday": 2,
    "lateToday": 2,
    "onLeaveToday": 0,
    "attendanceRate7Days": 0,
    "attendanceRate30Days": 0,
    "teamMembers": [
      {
        "employeeId": "uuid",
        "employeeName": "Alice Worker",
        "status": "present",
        "checkInTime": "8:45:30 AM"
      },
      {
        "employeeId": "uuid",
        "employeeName": "Bob Worker",
        "status": "late",
        "checkInTime": "9:20:15 AM"
      }
    ]
  },
  "meta": {
    "message": "Team attendance for John Manager"
  }
}
```

### 3.6 Get Monthly Trends

**Endpoint:** `GET /hyper/attendance/monthly-trends`

---

## 4. Conversational Dashboard

**Purpose:** Quick access to cross-module HR analytics

### 4.1 Get Headcount Distribution

**Endpoint:** `GET /hyper/dashboard/headcount-distribution`

**Access:** Manager, HR, Admin

**Response Example:**
```json
{
  "data": {
    "totalEmployees": 150,
    "byDepartment": [
      {
        "departmentName": "Engineering",
        "count": 50,
        "percentage": 33.3
      },
      {
        "departmentName": "Sales",
        "count": 30,
        "percentage": 20
      }
    ],
    "byDesignation": [
      {
        "designationName": "Software Engineer",
        "count": 35,
        "percentage": 23.3
      }
    ],
    "byLocation": [
      {
        "locationName": "New York",
        "count": 80,
        "percentage": 53.3
      }
    ]
  },
  "meta": {
    "message": "Headcount distribution for 150 employees"
  }
}
```

**Frontend Usage:**
```javascript
// User asks: "Give me department-wise headcount"
const response = await fetch('/hyper/dashboard/headcount-distribution', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 4.2 Get Open Positions

**Endpoint:** `GET /hyper/dashboard/open-positions`

### 4.3 Get Recent Hires

**Endpoint:** `GET /hyper/dashboard/recent-hires`

**Frontend Usage:**
```javascript
// User asks: "Who joined this week?"
const oneWeekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString();
const response = await fetch(
  `/hyper/dashboard/recent-hires?startDate=${oneWeekAgo}`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

### 4.4 Get Department Summary

**Endpoint:** `GET /hyper/dashboard/department-summary/:departmentId`

### 4.5 Get Leave Overview

**Endpoint:** `GET /hyper/dashboard/leave-overview`

### 4.6 Get Payroll Summary

**Endpoint:** `GET /hyper/dashboard/payroll-summary`

**Access:** HR, Admin

### 4.7 Get Performance Snapshot

**Endpoint:** `GET /hyper/dashboard/performance-snapshot`

### 4.8 Get Goals Stats

**Endpoint:** `GET /hyper/dashboard/goals-stats`

### 4.9 Get Quick Stats (All-in-One)

**Endpoint:** `GET /hyper/dashboard/quick-stats`

**Response Example:**
```json
{
  "data": {
    "employees": {
      "total": 150,
      "active": 150,
      "onLeaveToday": 5,
      "newHiresThisMonth": 8
    },
    "attendance": {
      "todayPresent": 135,
      "todayAbsent": 10,
      "attendanceRate": 90
    },
    "recruitment": {
      "openPositions": 12,
      "totalCandidates": 245,
      "interviewsThisWeek": 18
    },
    "leaves": {
      "pendingApprovals": 7,
      "approvedThisMonth": 35
    },
    "performance": {
      "reviewsDue": 5,
      "goalsOverdue": 12
    }
  },
  "meta": {
    "message": "Quick stats dashboard"
  }
}
```

---

## Frontend Integration Pattern

### React/Next.js Example

```typescript
// hooks/useHyperAPI.ts
import { useState, useEffect } from 'react';

export function useHyperAPI(endpoint: string, params?: Record<string, any>) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        const response = await fetch(`/api${endpoint}${queryString}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, params]);

  return { data, loading, error };
}

// components/ChatInterface.tsx
function ChatInterface() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const handleQuery = async (userQuery: string) => {
    // Simple query routing
    let endpoint = '';

    if (userQuery.includes('missing documents')) {
      endpoint = '/hyper/employee-lifecycle/missing-documents';
    } else if (userQuery.includes('attendance')) {
      endpoint = '/hyper/attendance/today-summary';
    } else if (userQuery.includes('headcount')) {
      endpoint = '/hyper/dashboard/headcount-distribution';
    }

    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    setMessages([...messages, {
      type: 'user',
      text: userQuery
    }, {
      type: 'assistant',
      text: data.meta.message,
      data: data.data
    }]);
  };

  return (
    <div className="chat-interface">
      {/* Render messages */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleQuery(query)}
      />
    </div>
  );
}
```

---

## Testing

### Using curl

```bash
# Login
curl -X POST http://localhost:8000/users-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get missing documents
curl -X GET http://localhost:8000/hyper/employee-lifecycle/missing-documents \
  -H "Authorization: Bearer <token>"

# Get today's attendance
curl -X GET http://localhost:8000/hyper/attendance/today-summary \
  -H "Authorization: Bearer <token>"

# Get quick stats
curl -X GET http://localhost:8000/hyper/dashboard/quick-stats \
  -H "Authorization: Bearer <token>"
```

---

## Common Query Mappings

| Natural Language Query | Endpoint | Method |
|------------------------|----------|--------|
| "Show employees with missing documents" | `/hyper/employee-lifecycle/missing-documents` | GET |
| "Who hasn't completed onboarding?" | `/hyper/employee-lifecycle/incomplete-onboarding` | GET |
| "Show mismatches between HRM and Payroll" | `/hyper/employee-lifecycle/role-mismatches` | GET |
| "Show interviews waiting for feedback" | `/hyper/recruitment/pending-feedback` | GET |
| "Best candidates for this job" | `/hyper/recruitment/candidate-matching/:id` | GET |
| "Show recruitment pipeline" | `/hyper/recruitment/pipeline-summary` | GET |
| "Today's attendance summary" | `/hyper/attendance/today-summary` | GET |
| "Who's been absent frequently?" | `/hyper/attendance/absentee-patterns` | GET |
| "Show late comers" | `/hyper/attendance/late-comers` | GET |
| "Detect attendance anomalies" | `/hyper/attendance/anomaly-detection` | GET |
| "Department-wise headcount" | `/hyper/dashboard/headcount-distribution` | GET |
| "Show open positions" | `/hyper/dashboard/open-positions` | GET |
| "Who joined this week?" | `/hyper/dashboard/recent-hires?startDate=...` | GET |
| "Leave overview" | `/hyper/dashboard/leave-overview` | GET |
| "Show me the dashboard" | `/hyper/dashboard/quick-stats` | GET |

---

## Benefits

### Reduced Manual Labor

| Traditional Workflow | With HYPER API |
|---------------------|----------------|
| Manually check each employee record for missing documents | One API call returns all employees with missing documents |
| Navigate multiple dashboards to track onboarding | Single endpoint shows all incomplete onboarding tasks |
| Manually calculate attendance percentages | Instant attendance summary with department breakdown |
| Manually match candidate skills to job requirements | Automated matching with percentage scores |
| Generate reports by querying multiple tables | Pre-aggregated intelligent insights |

### Key Advantages

1. **Single API Call** instead of multiple queries
2. **Pre-computed Insights** instead of frontend calculations
3. **Role-Based Filtering** built-in
4. **Consistent Response Format** across all endpoints
5. **Ready for Chat Interface** - structured for conversational UX

---

## Next Steps

1. **Add Natural Language Processing Layer** - Integrate an LLM to parse free-form queries and route to appropriate endpoints
2. **Add Notification System** - Implement email/in-app alerts for critical insights
3. **Add Caching Layer** - Cache frequently accessed insights for better performance
4. **Add Export Functionality** - Allow downloading reports as PDF/Excel
5. **Add Webhook Support** - Push notifications when anomalies are detected

---

## Support

For issues or questions, contact the development team or check the Swagger documentation at `/api-docs`.
