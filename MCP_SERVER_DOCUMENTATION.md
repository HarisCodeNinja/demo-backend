# MCP Server with Claude AI Integration - Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup & Configuration](#setup--configuration)
4. [API Endpoints](#api-endpoints)
5. [Available Tools](#available-tools)
6. [Usage Examples](#usage-examples)
7. [Integration Guide](#integration-guide)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **MCP (Model Context Protocol) Server** provides seamless integration between the HRM system and Claude AI, Anthropic's advanced language model. This integration enables intelligent, conversational interactions with HR data through natural language.

### Key Features

- **🤖 Claude AI Integration**: Direct integration with Anthropic's Claude API
- **🛠️ 14 Intelligent Tools**: Pre-built tools for accessing HRM data
- **📊 Dynamic Report Generation**: Generate reports in JSON, MD, and PDF from any prompt
- **💬 Conversational Interface**: Natural language queries for HR operations
- **🔐 Secure by Design**: Role-based access control on all endpoints
- **📈 HYPER Layer Access**: Leverage existing intelligent insights
- **🎯 Tool-Use Support**: Claude can automatically invoke tools to answer questions

### What is MCP?

Model Context Protocol (MCP) is a standardized protocol for connecting AI models to external data sources and tools. It enables:

- **Tool Discovery**: AI can discover what tools are available
- **Tool Execution**: AI can execute tools with proper parameters
- **Context Sharing**: Structured way to share context with AI
- **Resource Access**: AI can access external resources (databases, APIs, etc.)

---

## Architecture

### System Components

```
┌─────────────────┐
│  Frontend App   │
│   (React/Next)  │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────────────────────┐
│    Express MCP Server           │
│  ┌───────────────────────────┐ │
│  │  Chat Endpoint            │ │
│  │  /mcp/chat                │ │
│  └───────────┬───────────────┘ │
│              │                  │
│  ┌───────────▼───────────────┐ │
│  │  Claude Service           │ │
│  │  - Message handling       │ │
│  │  - Tool orchestration     │ │
│  └───────────┬───────────────┘ │
│              │                  │
│  ┌───────────▼───────────────┐ │
│  │  Tool Executor            │ │
│  │  - Execute tools          │ │
│  │  - Query database         │ │
│  └───────────┬───────────────┘ │
│              │                  │
└──────────────┼──────────────────┘
               │
               ▼
    ┌──────────────────┐
    │  Anthropic API   │
    │  (Claude AI)     │
    └──────────────────┘
               │
               ▼
    ┌──────────────────┐
    │  PostgreSQL DB   │
    │  (HRM Data)      │
    └──────────────────┘
```

### File Structure

```
src/modules/mcp-server/
├── types.ts              # TypeScript type definitions
├── tools.ts              # MCP tool definitions (12 tools)
├── toolExecutor.ts       # Tool execution logic
├── claudeService.ts      # Claude AI API integration
├── controller.ts         # Express route controllers
└── router.ts             # Route definitions
```

---

## Setup & Configuration

### 1. Environment Variables

Add your Claude API key to `.env`:

```env
# Claude AI API Key for MCP Server
CLAUDE_API_KEY=sk-ant-api03-...your-key-here...
```

### 2. Get Your Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy and paste into `.env`

### 3. Install Dependencies

The required packages are already installed:

```bash
npm install @anthropic-ai/sdk @modelcontextprotocol/sdk zod
```

### 4. Restart the Server

```bash
npm run dev
```

The MCP server will be available at: `http://localhost:8000/mcp`

---

## API Endpoints

All MCP endpoints are prefixed with `/mcp` and require authentication (Manager, HR, or Admin roles).

### Authentication

All endpoints (except `/mcp/status`) require a valid JWT token:

```http
Authorization: Bearer <your_access_token>
```

### Endpoint Reference

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/mcp/status` | GET | Health check and server status | No |
| `/mcp/capabilities` | GET | Get server capabilities info | Yes |
| `/mcp/tools` | GET | List all available tools | Yes |
| `/mcp/tools/call` | POST | Execute a specific tool | Yes |
| `/mcp/prompts` | GET | List available prompts | Yes |
| `/mcp/prompts/get` | POST | Get a specific prompt | Yes |
| `/mcp/chat` | POST | Chat with Claude AI | Yes |
| `/mcp/models` | GET | List available Claude models | Yes |

---

## Available Tools

The MCP server provides **14 intelligent tools** that Claude can use to interact with the HRM system:

### 🌟 FEATURED: Dynamic Report Generator

**NEW!** The most powerful tool - generate comprehensive reports from any natural language prompt!

#### Tool: `generate_dynamic_report`

Generate professional reports in **3 formats** (JSON, Markdown, PDF) from any natural language description.

**Examples:**
- "Employee headcount by department with attendance rates"
- "Recruitment pipeline analysis for Q1 2025"
- "Performance review summary with goal completion rates"
- "Leave balance analysis by department"

**See:** `DYNAMIC_REPORT_GENERATION.md` for complete documentation

---

### Standard HRM Tools

### 1. `get_employee_info`

Get detailed information about an employee.

**Input:**
```json
{
  "identifier": "employee@example.com" // or UUID
  "includeAttendance": false // optional
}
```

**Use Case:** "Tell me about John Doe's employment details"

---

### 2. `get_department_employees`

Get all employees in a department.

**Input:**
```json
{
  "departmentId": "uuid",
  "includeInactive": false
}
```

**Use Case:** "Show me all employees in the Engineering department"

---

### 3. `search_employees`

Search for employees by name, email, or other criteria.

**Input:**
```json
{
  "query": "john",
  "filters": {
    "departmentId": "uuid", // optional
    "designationId": "uuid" // optional
  },
  "limit": 10
}
```

**Use Case:** "Find all employees named Sarah"

---

### 4. `get_attendance_summary`

Get attendance data for a date range.

**Input:**
```json
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "employeeId": "uuid", // optional
  "departmentId": "uuid" // optional
}
```

**Use Case:** "What was the attendance rate last month?"

---

### 5. `get_leave_requests`

Get leave applications with filters.

**Input:**
```json
{
  "status": "pending", // pending|approved|rejected
  "employeeId": "uuid", // optional
  "limit": 20
}
```

**Use Case:** "Show me all pending leave requests"

---

### 6. `get_job_openings`

Get active job openings.

**Input:**
```json
{
  "departmentId": "uuid", // optional
  "status": "open",
  "includeApplications": false
}
```

**Use Case:** "What positions are we hiring for?"

---

### 7. `get_candidates`

Get recruitment candidates.

**Input:**
```json
{
  "jobOpeningId": "uuid", // optional
  "status": "interview",
  "limit": 20
}
```

**Use Case:** "Show me candidates interviewing for the Developer role"

---

### 8. `get_performance_reviews`

Get employee performance reviews.

**Input:**
```json
{
  "employeeId": "uuid", // optional
  "status": "completed"
}
```

**Use Case:** "Get John's latest performance review"

---

### 9. `get_hyper_insights`

Access HYPER intelligent insights.

**Input:**
```json
{
  "insightType": "missing_documents", // see types below
  "filters": {
    "departmentId": "uuid" // optional
  }
}
```

**Insight Types:**
- `missing_documents`
- `incomplete_onboarding`
- `attendance_summary`
- `absentee_patterns`
- `recruitment_pipeline`
- `pending_feedback`
- `quick_stats`

**Use Case:** "Show employees with missing documents"

---

### 10. `get_departments`

Get list of all departments.

**Input:**
```json
{
  "includeEmployeeCount": true
}
```

**Use Case:** "List all departments with headcount"

---

### 11. `create_leave_request`

Create a new leave request.

**Input:**
```json
{
  "employeeId": "uuid",
  "leaveTypeId": "uuid",
  "startDate": "2025-02-01",
  "endDate": "2025-02-05",
  "reason": "Vacation"
}
```

**Use Case:** "Request leave for Sarah from Feb 1 to Feb 5"

---

### 12. `get_employee_goals`

Get an employee's goals and objectives.

**Input:**
```json
{
  "employeeId": "uuid",
  "status": "active" // active|completed|overdue
}
```

**Use Case:** "What are John's current goals?"

---

### 13. `generate_quick_report`

Generate predefined standard reports quickly.

**Input:**
```json
{
  "reportType": "headcount", // or attendance, recruitment, etc.
  "filters": {
    "departmentId": "uuid",
    "startDate": "2025-01-01",
    "endDate": "2025-01-31"
  }
}
```

**Available Types:**
- `headcount` - Employee distribution report
- `attendance` - Attendance analysis
- `recruitment` - Recruitment pipeline
- `performance` - Performance reviews
- `leaves` - Leave management
- `onboarding` - Onboarding status
- `payroll` - Payroll summary

**Use Case:** "Generate a recruitment report for last month"

---

## Usage Examples

### Example 1: Chat Endpoint

**Request:**

```http
POST /mcp/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How many employees are in the Engineering department?",
  "useTools": true
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "response": "Based on the data, there are currently 50 employees in the Engineering department. Here's the breakdown: 35 Software Engineers, 8 Senior Engineers, 5 Team Leads, and 2 Engineering Managers.",
    "toolCalls": [
      {
        "name": "get_department_employees",
        "input": {
          "departmentId": "engineering-uuid",
          "includeInactive": false
        },
        "result": {
          "content": [
            {
              "type": "text",
              "text": "{\"count\": 50, \"employees\": [...]}"
            }
          ]
        }
      }
    ],
    "usage": {
      "input_tokens": 1250,
      "output_tokens": 180
    }
  }
}
```

---

### Example 2: Direct Tool Call

**Request:**

```http
POST /mcp/tools/call
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "get_attendance_summary",
  "arguments": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-07"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "type": "text",
        "text": "{\"totalRecords\": 750, \"present\": 680, \"absent\": 50, \"late\": 20}"
      }
    ]
  }
}
```

---

### Example 3: Using Prompts

**Request:**

```http
POST /mcp/prompts/get
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "employee_onboarding_check",
  "arguments": {
    "days": "30"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "description": "Prompt: employee_onboarding_check",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please check the onboarding status of employees who joined in the last 30 days..."
        }
      }
    ]
  }
}
```

---

## Integration Guide

### Frontend Integration (React/Next.js)

#### 1. Create a Chat Hook

```typescript
// hooks/useMCPChat.ts
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useMCPChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/mcp/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages,
          useTools: true,
        }),
      });

      const data = await response.json();

      // Add assistant response
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.data.response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
```

#### 2. Create Chat Component

```typescript
// components/HRChatBot.tsx
'use client';

import { useState } from 'react';
import { useMCPChat } from '@/hooks/useMCPChat';

export function HRChatBot() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, loading } = useMCPChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="loading">Claude is thinking...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about HR data..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
```

#### 3. Example Queries

Users can ask natural language questions like:

- "How many employees are in Engineering?"
- "Show me all pending leave requests"
- "Who has incomplete onboarding?"
- "What's the attendance rate for last week?"
- "Find employees with missing documents"
- "Show me all open job positions"
- "Get John Doe's performance review"

---

### Backend Integration (Other Services)

You can also call the MCP chat programmatically from other backend services:

```typescript
import { claudeService } from './modules/mcp-server/claudeService';

async function getHRInsight() {
  const result = await claudeService.chat(
    "Show me employees with incomplete onboarding",
    [],
    true,
    req
  );

  console.log(result.response);
  console.log('Tools used:', result.toolCalls);
}
```

---

## Security

### Authentication & Authorization

- All MCP endpoints (except `/status`) require JWT authentication
- Minimum role requirement: **Manager, HR, or Admin**
- Tool execution respects existing HRM permissions
- No data modification without proper authorization

### API Key Security

- Store Claude API key in `.env` file (never commit)
- Use environment variables for production
- Rotate API keys regularly
- Monitor API usage in Anthropic Console

### Data Privacy

- Claude AI only receives data you explicitly query
- No automatic data syncing to Anthropic
- Conversation history is not stored by default
- Implement logging/auditing for compliance

---

## Troubleshooting

### Issue: "Claude API error: Invalid API key"

**Solution:**
1. Check `.env` file has correct `CLAUDE_API_KEY`
2. Verify key starts with `sk-ant-api03-`
3. Test key in Anthropic Console
4. Restart the server after updating `.env`

---

### Issue: "Tool execution failed"

**Solution:**
1. Check database connection
2. Verify employee/department IDs exist
3. Check tool arguments match schema
4. Review server logs for detailed errors

---

### Issue: "Rate limit exceeded"

**Solution:**
1. Check Anthropic Console for usage limits
2. Implement request throttling
3. Consider upgrading API tier
4. Cache common queries

---

### Issue: "Authentication failed"

**Solution:**
1. Verify JWT token is valid
2. Check user has required role (Manager/HR/Admin)
3. Ensure token is sent in Authorization header
4. Token format: `Bearer <token>`

---

## Advanced Configuration

### Custom System Prompt

Modify the system prompt in `claudeService.ts` to customize Claude's behavior:

```typescript
const systemPrompt = `You are an AI assistant for...`;
```

### Add New Tools

1. Define tool schema in `tools.ts`
2. Implement execution logic in `toolExecutor.ts`
3. Add tool to `mcpTools` array

### Streaming Responses

For real-time streaming responses:

```typescript
const stream = await claudeService.streamChat(message, history, true);

for await (const chunk of stream) {
  // Handle streamed chunks
  console.log(chunk);
}
```

---

## API Reference Summary

### Base URL
```
http://localhost:8000/mcp
```

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format

All successful responses follow this format:

```json
{
  "status": "success",
  "data": {
    // Response data here
  }
}
```

Error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## Support & Resources

- **Dynamic Report Generation Guide**: `DYNAMIC_REPORT_GENERATION.md`
- **Anthropic Documentation**: https://docs.anthropic.com/
- **MCP Specification**: https://modelcontextprotocol.io/
- **Claude API Reference**: https://docs.anthropic.com/claude/reference
- **HYPER API Docs**: See `HYPER_API_DOCUMENTATION.md`

---

## Future Enhancements

Planned features for future releases:

- [ ] Streaming chat responses
- [ ] Conversation history persistence
- [ ] Multi-turn conversation context
- [ ] Custom prompt templates
- [ ] Resource endpoints (documents, reports)
- [ ] Webhook support for proactive notifications
- [ ] Admin dashboard for MCP analytics
- [ ] Fine-tuned responses based on company policies

---

## License

This MCP server integration is part of the HRM system (AGPLv3 License).

---

**Last Updated:** 2025-01-18
**Version:** 1.0.0
**Maintained by:** Hyper Development Team
