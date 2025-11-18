# MCP Server Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-`)

### Step 2: Configure Environment

Open `.env` file and add your Claude API key:

```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

### Step 3: Start the Server

```bash
npm run dev
```

The MCP server is now running at `http://localhost:8000/mcp`!

## ✅ Test Your Setup

### 1. Health Check (No Auth Required)

```bash
curl http://localhost:8000/mcp/status
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "serverStatus": "online",
    "claudeApiConnected": true,
    "availableTools": 12,
    "timestamp": "2025-01-18T..."
  }
}
```

### 2. Login to Get Auth Token

```bash
curl -X POST http://localhost:8000/users-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

Save the `accessToken` from the response.

### 3. Test Chat with Claude

Replace `YOUR_TOKEN` with your access token:

```bash
curl -X POST http://localhost:8000/mcp/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How many employees are in the company?",
    "useTools": true
  }'
```

Claude will automatically use the available tools to query your HRM database and respond!

## 📚 What Can You Ask?

Try these example queries:

- "How many employees are in Engineering?"
- "Show me all pending leave requests"
- "Who has incomplete onboarding?"
- "What's the attendance rate this week?"
- "Find employees named John"
- "Show me open job positions"
- "Get the latest performance reviews"
- "Who is absent today?"

## 🛠️ Available Tools

The MCP server provides 12 tools that Claude can use:

1. `get_employee_info` - Get employee details
2. `get_department_employees` - List employees by department
3. `search_employees` - Search for employees
4. `get_attendance_summary` - Get attendance data
5. `get_leave_requests` - Get leave applications
6. `get_job_openings` - List job openings
7. `get_candidates` - Get recruitment candidates
8. `get_performance_reviews` - Get reviews
9. `get_hyper_insights` - Access HYPER analytics
10. `get_departments` - List departments
11. `create_leave_request` - Create leave request
12. `get_employee_goals` - Get goals

## 📖 Full Documentation

For complete documentation, see:
- `MCP_SERVER_DOCUMENTATION.md` - Comprehensive guide
- `src/modules/mcp-server/README.md` - Technical details

## 🔐 Security Notes

- All endpoints (except `/status`) require authentication
- Minimum role: Manager, HR, or Admin
- Never commit your API key to version control
- Rotate your API key regularly

## 🆘 Troubleshooting

**Server won't start?**
- Check that `.env` has `CLAUDE_API_KEY`
- Verify database is running
- Check port 8000 is available

**"Invalid API key" error?**
- Verify key starts with `sk-ant-api03-`
- Check for extra spaces in `.env`
- Test key in Anthropic Console
- Restart the server after updating `.env`

**"Authentication failed" error?**
- Get a fresh token from login endpoint
- Check token format: `Bearer <token>`
- Verify user has Manager/HR/Admin role

## 🎉 Success!

You now have a fully functional MCP server with Claude AI integration!

Claude can now intelligently interact with your HRM system using natural language.

## 📊 API Endpoints Reference

Base URL: `http://localhost:8000/mcp`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/status` | GET | No | Health check |
| `/capabilities` | GET | Yes | Server info |
| `/tools` | GET | Yes | List tools |
| `/tools/call` | POST | Yes | Execute tool |
| `/prompts` | GET | Yes | List prompts |
| `/chat` | POST | Yes | Chat with Claude |
| `/models` | GET | Yes | Available models |

## 🚀 Next Steps

1. **Frontend Integration**: Build a chat UI using the examples in the documentation
2. **Custom Prompts**: Add domain-specific prompts for your use cases
3. **New Tools**: Extend with custom tools for your needs
4. **Monitoring**: Set up logging and usage tracking

---

Need help? Check the full documentation or review the code in `src/modules/mcp-server/`
