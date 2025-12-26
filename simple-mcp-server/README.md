# Simple MCP Server - Mini HRM Version

A minimal MCP server that mirrors the structure of the full HRM MCP server with:
- ✅ Proper file separation (tools.js, toolExecutor.js, server.js)
- ✅ 2 real HRM tools (search_employees, get_departments)
- ✅ OAuth2 authentication
- ✅ RPC-only endpoint
- ✅ Mock data (no database required)

## File Structure

```
simple-mcp-server/
├── server.js           # Main HTTP server with routes and auth
├── tools.js            # Tool definitions (schemas)
├── toolExecutor.js     # Tool execution logic with mock data
├── stdio-proxy.js      # STDIO proxy for Claude Desktop
├── test-client.js      # Automated tests
├── package.json        # Dependencies
└── README.md          # This file
```

## Tools

### 1. search_employees

Search employees by name or email with optional filters.

**Parameters:**
- `query` (string, optional): Search term for name or email
- `filters` (object, optional):
  - `departmentId` (string): Filter by department UUID
  - `status` (string): Filter by status (active/inactive)
- `limit` (number, optional): Max results (default: 20)

**Example:**
```json
{
  "name": "search_employees",
  "arguments": {
    "query": "John",
    "filters": {
      "departmentId": "650e8400-e29b-41d4-a716-446655440001"
    },
    "limit": 10
  }
}
```

**Response:**
```json
{
  "data": {
    "employees": [
      {
        "employeeId": "550e8400-e29b-41d4-a716-446655440001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@company.com",
        "departmentName": "Engineering",
        "designationName": "Senior Engineer",
        "status": "active"
      }
    ],
    "count": 1,
    "total": 1
  },
  "meta": {
    "message": "Found 1 employee(s) matching \"John\"",
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. get_departments

Get list of all departments with employee counts.

**Parameters:**
- `includeEmployeeCount` (boolean, optional): Include employee count (default: true)

**Example:**
```json
{
  "name": "get_departments",
  "arguments": {
    "includeEmployeeCount": true
  }
}
```

**Response:**
```json
{
  "data": {
    "departments": [
      {
        "departmentId": "650e8400-e29b-41d4-a716-446655440001",
        "departmentName": "Engineering",
        "description": "Software development and engineering",
        "employeeCount": 3
      }
    ],
    "count": 3
  },
  "meta": {
    "message": "Found 3 department(s)",
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

## Mock Data

The server includes mock data for:
- **5 Employees** across 3 departments
- **3 Departments**: Engineering, Human Resources, Marketing

This allows testing without a real database.

## Quick Start

### 1. Install Dependencies

```bash
cd simple-mcp-server
npm install
```

### 2. Start the Server

```bash
npm start
```

Output:
```
╔═══════════════════════════════════════════════════╗
║      Simple MCP Server - Mini HRM Version       ║
╚═══════════════════════════════════════════════════╝

🚀 Server running on http://localhost:3001

📋 Available Tools:
   1. search_employees
      Search employees by name or email...
   2. get_departments
      Get list of all departments...

🔐 OAuth Credentials:
   Client ID: simple-mcp-client
   Client Secret: simple-mcp-secret-123

📂 File Structure:
   server.js         - Main server (routes & auth)
   tools.js          - Tool definitions
   toolExecutor.js   - Tool execution logic
```

### 3. Test the Server

```bash
npm test
```

Output shows all tests passing with actual employee/department data.

## Connect with Claude Desktop

### 1. Edit Claude Desktop Config

Location:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS/Linux: `~/.config/Claude/claude_desktop_config.json`

Add:
```json
{
  "mcpServers": {
    "simple-mcp": {
      "command": "node",
      "args": [
        "C:/Users/YourName/Downloads/HRM-backend-1217/simple-mcp-server/stdio-proxy.js"
      ],
      "env": {
        "REMOTE_MCP_URL": "http://localhost:3001",
        "MCP_CLIENT_ID": "simple-mcp-client",
        "MCP_CLIENT_SECRET": "simple-mcp-secret-123"
      }
    }
  }
}
```

### 2. Restart Claude Desktop

### 3. Test with Claude

Ask Claude:
- "Show me all employees"
- "Search for employees named John"
- "List all departments with employee counts"
- "Show me employees in the Engineering department"

## Architecture

This mini version follows the same structure as the full HRM MCP server:

```
┌─────────────────────────────────────────────────────┐
│                  Full HRM MCP Server                │
├─────────────────────────────────────────────────────┤
│ router.ts          →  server.js (routes)            │
│ tools.ts           →  tools.js (same)               │
│ toolExecutor.ts    →  toolExecutor.js (simplified)  │
│ controller.ts      →  server.js (handlers)          │
│ Database (PG)      →  Mock data (arrays)            │
│ 16 tools           →  2 tools                       │
└─────────────────────────────────────────────────────┘
```

## Comparison

| Feature | Full MCP | Simple MCP |
|---------|----------|------------|
| **Files** | 15+ files | 4 core files |
| **Tools** | 16 tools | 2 tools |
| **Database** | PostgreSQL + Sequelize | Mock arrays |
| **Routes** | Multiple endpoints | RPC only |
| **Lines of Code** | ~2000+ | ~600 |
| **File Structure** | Same ✓ | Same ✓ |
| **OAuth Flow** | Same ✓ | Same ✓ |
| **RPC Protocol** | Same ✓ | Same ✓ |

## Adding Your Own Tool

### Step 1: Define Tool in `tools.js`

```javascript
{
  name: 'my_custom_tool',
  description: 'Description of what it does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description',
      },
    },
    required: ['param1'],
  },
}
```

### Step 2: Add Executor in `toolExecutor.js`

```javascript
async function myCustomTool(args) {
  const { param1 } = args;

  // Your logic here
  const result = {
    data: {
      output: `Processed: ${param1}`,
    },
    meta: {
      message: 'Success',
      timestamp: new Date().toISOString(),
    },
  };

  return createToolResponse(result);
}
```

### Step 3: Add to Switch in `toolExecutor.js`

```javascript
async function execute(toolName, args, req) {
  switch (toolName) {
    case 'search_employees':
      return await searchEmployees(args);
    case 'get_departments':
      return await getDepartments(args);
    case 'my_custom_tool':  // Add this
      return await myCustomTool(args);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
```

That's it! Restart the server and your tool is ready.

## Connecting to Real Database

To connect to a real database instead of mock data:

### 1. Install Sequelize

```bash
npm install sequelize pg pg-hstore
```

### 2. Update `toolExecutor.js`

Replace mock data with Sequelize queries:

```javascript
const { Employee, Department } = require('../employee/model');

async function searchEmployees(args) {
  const { query = '', limit = 20 } = args;

  const employees = await Employee.findAll({
    where: {
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } },
      ],
    },
    include: [
      { model: Department, as: 'department' },
    ],
    limit,
  });

  return createToolResponse({
    data: { employees: employees.map(e => e.toJSON()) },
    meta: { message: `Found ${employees.length} employees` },
  });
}
```

## API Reference

### POST /oauth/token

Get OAuth access token.

**Request:**
```json
{
  "grant_type": "client_credentials",
  "client_id": "simple-mcp-client",
  "client_secret": "simple-mcp-secret-123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### POST /rpc

JSON-RPC 2.0 endpoint.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Methods:**
- `initialize` - Initialize connection
- `tools/list` - List all tools
- `tools/call` - Execute a tool

### GET /health

Health check.

**Response:**
```json
{
  "status": "healthy",
  "server": "simple-mcp-server",
  "toolsCount": 2,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Port 3001 in use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :3001
kill -9 {PID}

# Or change port
PORT=3002 npm start
```

### Claude Desktop not connecting
1. Ensure server is running (`npm start`)
2. Check config path is correct
3. Restart Claude Desktop
4. Check MCP logs in Claude Desktop

## Learn More

- Compare with full implementation: `../src/modules/mcp-server/`
- Full documentation: `../MCP_ARCHITECTURE_DOCUMENTATION.md`
- MCP Specification: https://modelcontextprotocol.io/

## License

MIT
