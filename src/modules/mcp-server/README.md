# MCP Server Module

## Quick Start

This module implements the Model Context Protocol (MCP) server with Claude AI integration for the HRM system.

### Setup

1. **Add Claude API Key to `.env`:**

```env
CLAUDE_API_KEY=sk-ant-api03-your-key-here
```

2. **Start the server:**

```bash
npm run dev
```

3. **Test the MCP server:**

```bash
curl http://localhost:8000/mcp/status
```

### Endpoints

All endpoints are prefixed with `/mcp`:

- `GET /mcp/status` - Health check (public)
- `GET /mcp/capabilities` - Server capabilities (auth required)
- `GET /mcp/tools` - List all tools (auth required)
- `POST /mcp/tools/call` - Execute a tool (auth required)
- `POST /mcp/chat` - Chat with Claude AI (auth required)
- `GET /mcp/models` - List available models (auth required)

### Example Chat Request

```bash
curl -X POST http://localhost:8000/mcp/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How many employees are in Engineering?",
    "useTools": true
  }'
```

### Available Tools

1. **get_employee_info** - Get employee details
2. **get_department_employees** - List employees by department
3. **search_employees** - Search for employees
4. **get_attendance_summary** - Get attendance data
5. **get_leave_requests** - Get leave applications
6. **get_job_openings** - List job openings
7. **get_candidates** - Get recruitment candidates
8. **get_performance_reviews** - Get performance reviews
9. **get_hyper_insights** - Access HYPER analytics
10. **get_departments** - List all departments
11. **create_leave_request** - Create leave request
12. **get_employee_goals** - Get employee goals

### Module Structure

```
mcp-server/
├── README.md           # This file
├── types.ts            # TypeScript types
├── tools.ts            # Tool definitions
├── toolExecutor.ts     # Tool execution logic
├── claudeService.ts    # Claude AI integration
├── controller.ts       # Route controllers
└── router.ts           # Express routes
```

### How It Works

1. User sends a natural language query to `/mcp/chat`
2. Claude AI receives the query and available tools
3. Claude decides which tools to use (if any)
4. Tools are executed against HRM database
5. Results are returned to Claude
6. Claude formulates a natural language response
7. Response is sent back to user

### Security

- JWT authentication required
- Minimum role: Manager, HR, or Admin
- API key stored in environment variables
- Tool execution respects HRM permissions

### Documentation

See `MCP_SERVER_DOCUMENTATION.md` in the project root for comprehensive documentation.

### Example Queries

Natural language queries Claude can handle:

- "Show me all employees in Engineering"
- "How many people are on leave today?"
- "Get pending leave requests"
- "Who has incomplete onboarding?"
- "What's the attendance rate this week?"
- "Find employees named John"
- "Show open job positions"

### Dependencies

- `@anthropic-ai/sdk` - Anthropic's Claude API client
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `zod` - Schema validation

### Configuration

Environment variables:

```env
CLAUDE_API_KEY=sk-ant-api03-...  # Required: Your Claude API key
```

Default Claude model: `claude-3-5-sonnet-20241022`

### Troubleshooting

**"Claude API error"**
- Check your API key in `.env`
- Verify key is valid in Anthropic Console
- Restart the server

**"Tool execution failed"**
- Check database connection
- Verify tool arguments
- Review server logs

**"Authentication failed"**
- Check JWT token is valid
- Verify user has required role
- Token format: `Bearer <token>`

### Development

To add a new tool:

1. Add tool definition to `tools.ts`
2. Implement execution in `toolExecutor.ts`
3. Add to `mcpTools` array

### Testing

Test the status endpoint:
```bash
curl http://localhost:8000/mcp/status
```

Test with authentication:
```bash
# First, login to get token
TOKEN=$(curl -X POST http://localhost:8000/users-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.data.accessToken')

# Then use the token
curl -X GET http://localhost:8000/mcp/capabilities \
  -H "Authorization: Bearer $TOKEN"
```

### Support

For issues or questions:
- See full documentation: `MCP_SERVER_DOCUMENTATION.md`
- Check Anthropic docs: https://docs.anthropic.com/
- Review server logs for errors
