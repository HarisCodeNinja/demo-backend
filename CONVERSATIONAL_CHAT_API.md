# Conversational Chat API - Full Claude AI Access

This document describes the new conversational chat endpoints that give you full access to Claude AI, where Claude autonomously decides when and which tools to use.

## Overview

Your MCP server now has **three ways** to interact with Claude:

1. **stdio-server.ts** → Local Claude Desktop (MCP Protocol)
2. **Existing /mcp/chat** → Direct tool-based responses (structured)
3. **NEW /mcp/chat/conversational** → Full AI conversation (Claude decides)

---

## New Endpoints

### 1. Conversational Chat (POST)

**Endpoint:** `POST /mcp/chat/conversational`

Claude handles the entire conversation, autonomously using tools when needed.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Show me attendance summary for last week and find employees with more than 2 absences"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on the attendance data, here's what I found:\n\n15 employees had more than 2 absences last week. The most concerning cases are:\n\n1. John Doe (Engineering) - 4 absences\n2. Jane Smith (Sales) - 3 absences\n\nWould you like me to generate a detailed report?",
  "fullResponse": { ... },
  "toolsUsed": true,
  "iterationCount": 2
}
```

**Features:**
- Claude analyzes your request
- Automatically calls appropriate tools
- Combines data from multiple sources
- Provides natural language responses
- Handles multi-turn conversations

---

### 2. Streaming Chat (POST)

**Endpoint:** `POST /mcp/chat/stream`

Real-time streaming responses using Server-Sent Events (SSE).

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tell me about our recruitment pipeline"
    }
  ]
}
```

**Response Stream (SSE):**
```
data: {"type":"text","content":"Let me check"}

data: {"type":"tool_start","name":"get_job_openings"}

data: {"type":"text","content":"You currently have 5 open positions..."}

data: {"type":"done"}
```

**Event Types:**
- `text` - Streaming text chunks
- `tool_start` - Tool execution started
- `error` - Error occurred
- `done` - Stream completed

---

### 3. Chat Health Check (GET)

**Endpoint:** `GET /mcp/chat/health`

Check if conversational chat is properly configured.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "apiKeyConfigured": true,
  "toolsAvailable": 17,
  "model": "claude-sonnet-4-20250514"
}
```

---

## Complete API Comparison

### Option A: Structured Tool Response (Existing)
```bash
POST /mcp/chat
```
- **Use Case:** Direct tool access with AI formatting
- **Response:** Structured data or formatted text
- **Claude Role:** Formats results, limited conversation
- **Best For:** Predefined queries, data retrieval

### Option B: Conversational AI (NEW)
```bash
POST /mcp/chat/conversational
```
- **Use Case:** Natural conversations with AI
- **Response:** Natural language with data integration
- **Claude Role:** Full AI agent, decides when to use tools
- **Best For:** Complex queries, analysis, insights

### Option C: Streaming Conversational (NEW)
```bash
POST /mcp/chat/stream
```
- **Use Case:** Real-time AI responses
- **Response:** Server-Sent Events stream
- **Claude Role:** Full AI agent with streaming
- **Best For:** Interactive UIs, live chat interfaces

---

## Usage Examples

### Example 1: Multi-Step Analysis

**Request:**
```bash
curl -X POST http://localhost:3000/mcp/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Analyze our department headcount and identify which departments are understaffed compared to average"
      }
    ]
  }'
```

**What Claude Does:**
1. Calls `get_departments` tool
2. Calls `search_employees` for each department
3. Calculates statistics
4. Provides analysis with recommendations

---

### Example 2: Conversational Follow-ups

**Initial Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How many employees do we have?"
    }
  ]
}
```

**Follow-up Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How many employees do we have?"
    },
    {
      "role": "assistant",
      "content": "You have 250 employees across 8 departments."
    },
    {
      "role": "user",
      "content": "Which department has the most?"
    }
  ]
}
```

Claude remembers context and answers follow-ups.

---

### Example 3: Streaming Chat (Frontend)

```javascript
const eventSource = new EventSource('/mcp/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Generate attendance report for last month' }
    ]
  })
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'text') {
    console.log('Claude:', data.content);
  } else if (data.type === 'tool_start') {
    console.log('Using tool:', data.name);
  } else if (data.type === 'done') {
    eventSource.close();
  }
};
```

---

## Architecture

### How It Works

```
User Request
    ↓
Conversational Endpoint
    ↓
Claude AI (analyzes request)
    ↓
[Decides to use tools] ───→ ToolExecutor
    ↓                              ↓
[Gets tool results] ←──────────────┘
    ↓
Claude AI (interprets results)
    ↓
Natural Language Response
```

---

## All Available Tools

Claude can use any of these 17 tools autonomously:

### Employee Management
- `get_employee_info` - Get employee details
- `search_employees` - Search by name/email
- `get_department_employees` - List dept employees
- `get_departments` - List all departments

### Attendance & Leave
- `get_attendance_summary` - Attendance stats
- `get_leave_requests` - Leave request list
- `create_leave_request` - Submit leave

### Recruitment
- `get_job_openings` - Active job postings
- `get_candidates` - Candidate pipeline

### Performance
- `get_performance_reviews` - Review data
- `get_employee_goals` - Goals & objectives

### Insights & Reports
- `get_hyper_insights` - AI-powered insights
- `generate_dynamic_report` - Custom reports
- `generate_quick_report` - Predefined reports

### Database Access
- `get_database_schema` - Schema info
- `execute_sql_query` - Run SQL
- `get_table_info` - Table details

---

## Configuration

### Required Environment Variables

```env
# .env file
CLAUDE_API_KEY=sk-ant-api03-xxxx
```

### Check Configuration

```bash
curl http://localhost:3000/mcp/chat/health
```

---

## Complete Access Methods Summary

| Method | Transport | Use Case | Claude Role |
|--------|-----------|----------|-------------|
| **stdio-server.ts** | stdio | Claude Desktop | MCP Protocol |
| **/mcp/chat** | HTTP | Structured data | Tool wrapper |
| **/mcp/chat/conversational** | HTTP | Full conversation | AI agent |
| **/mcp/chat/stream** | SSE | Real-time chat | Streaming AI |

---

## Benefits of Conversational Mode

✅ **Natural Language** - Ask questions naturally
✅ **Autonomous Tool Use** - Claude decides what data to fetch
✅ **Multi-Step Reasoning** - Complex analysis across tools
✅ **Context Awareness** - Remembers conversation history
✅ **Smart Responses** - Insights, not just data dumps
✅ **Follow-ups** - Handle related questions

---

## Testing

### Quick Test
```bash
# Health check
curl http://localhost:3000/mcp/chat/health

# Simple query
curl -X POST http://localhost:3000/mcp/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"How many employees do we have?"}]}'
```

---

## Error Handling

### Common Errors

**API Key Not Configured:**
```json
{
  "success": false,
  "error": "CLAUDE_API_KEY is not configured"
}
```

**Invalid Message Format:**
```json
{
  "error": "Messages array required"
}
```

**Tool Execution Error:**
```json
{
  "success": true,
  "message": "I tried to fetch the data but encountered an error: Database connection failed",
  "toolsUsed": true
}
```

---

## Best Practices

1. **Use Conversational for Complex Queries**
   - "Analyze X and suggest Y"
   - Multi-step operations
   - When you want insights, not raw data

2. **Use Structured /mcp/chat for Simple Data**
   - Direct tool calls
   - Known data retrieval
   - When you want JSON responses

3. **Use Streaming for UIs**
   - Real-time interfaces
   - Chat applications
   - Progress indicators

4. **Maintain Conversation Context**
   - Include full message history
   - For follow-up questions
   - Better continuity

---

## Security Note

These endpoints have the same access level as other MCP endpoints. Claude can only use the defined tools and has the same database permissions as your application.

---

## Support

For issues:
- Check `/mcp/chat/health` endpoint
- Verify `CLAUDE_API_KEY` in `.env`
- Review server logs for tool execution errors
- Test with simple queries first

---

## Next Steps

1. Test the health endpoint
2. Try a simple conversational query
3. Build a frontend with streaming support
4. Integrate into your HRM dashboard

Your existing implementation remains unchanged - these are **additions** that enhance your capabilities!
