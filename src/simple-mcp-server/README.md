# Simple MCP Server - Mini HRM Version

A minimal MCP server integrated into the main HRM application with:

- ✅ Proper file separation (controller, router, middleware, tools, toolExecutor)
- ✅ 2 real HRM tools (search_employees, get_departments)
- ✅ OAuth2 authentication
- ✅ RPC-only endpoint
- ✅ Real database integration using HRM services
- ✅ Routes integrated into main HRM app

## File Structure

```
simple-mcp-server/
├── controller.ts       # Route handlers (static methods)
├── router.ts           # Express router definition
├── middleware.ts       # JWT authentication middleware
├── tools.ts            # Tool definitions (schemas)
├── toolExecutor.ts     # Tool execution logic with real HRM services
├── schemas.ts          # Zod validation schemas
├── stdio-proxy.ts      # STDIO proxy for Claude Desktop
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies
└── README.md          # This file
```

## Architecture

This module follows the same pattern as other HRM modules - routes are registered in the main app:

```
defaultRoutes.ts (src/config/routes/)
  └── '/simple-mcp' → SimpleMCPRoutes
       ├── POST /simple-mcp/oauth/token  (public)
       ├── GET  /simple-mcp/health       (public)
       └── POST /simple-mcp/rpc          (authenticated)
```

## Tools

### 1. search_employees

Get paginated employee list from the real HRM database.

**Parameters:**

- `page` (number, optional): Page number (default: 0)
- `pageSize` (number, optional): Results per page (default: 20, max: 100)

**Example:**

```json
{
  "name": "search_employees",
  "arguments": {
    "page": 0,
    "pageSize": 20
  }
}
```

**Response:**

```json
{
  "data": {
    "employees": [...],
    "count": 20,
    "total": 150
  },
  "meta": {
    "page": 0,
    "pageSize": 20,
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. get_departments

Get paginated department list from the real HRM database.

**Parameters:**

- `includeEmployeeCount` (boolean, optional): Include employee count (default: true)
- `page` (number, optional): Page number (default: 0)
- `pageSize` (number, optional): Results per page (default: 20, max: 100)

**Example:**

```json
{
  "name": "get_departments",
  "arguments": {
    "includeEmployeeCount": true,
    "page": 0,
    "pageSize": 20
  }
}
```

## Quick Start

### 1. Routes are Auto-loaded

The simple-mcp-server routes are automatically registered when the main HRM app starts.

No separate server startup needed! Just run the main HRM application:

```bash
# From project root
npm start
```

The routes will be available at:

- `http://localhost:3000/simple-mcp/oauth/token`
- `http://localhost:3000/simple-mcp/rpc`
- `http://localhost:3000/simple-mcp/health`

### 2. Test the Health Endpoint

```bash
curl http://localhost:3000/simple-mcp/health
```

Expected response:

```json
{
  "status": "healthy",
  "server": "simple-mcp-server",
  "toolsCount": 2,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 3. Get OAuth Token

```bash
curl -X POST http://localhost:3000/simple-mcp/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "simple-mcp-client",
    "client_secret": "simple-mcp-secret-123"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 4. Call a Tool via RPC

```bash
curl -X POST http://localhost:3000/simple-mcp/rpc \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_employees",
      "arguments": {
        "page": 0,
        "pageSize": 10
      }
    }
  }'
```

## Connect with Claude Desktop

### 1. Build the STDIO Proxy

```bash
cd src/simple-mcp-server
npm run build
```

### 2. Edit Claude Desktop Config

Location:

- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS/Linux: `~/.config/Claude/claude_desktop_config.json`

Add:

```json
{
  "mcpServers": {
    "simple-mcp": {
      "command": "node",
      "args": ["C:/Users/HarisShahid/Downloads/HRM-backend-1217/src/simple-mcp-server/dist/simple-mcp-server/stdio-proxy.js"],
      "env": {
        "REMOTE_MCP_URL": "http://localhost:{port_on_which_your_server_is_running}/simple-mcp",
        "MCP_CLIENT_ID": "simple-mcp-client",
        "MCP_CLIENT_SECRET": "simple-mcp-secret-123"
      }
    }
  }
}
```

**Note:** Update `REMOTE_MCP_URL` to point to the main HRM app's base URL + `/simple-mcp`

### 3. Restart Claude Desktop

### 4. Test with Claude

Ask Claude:

- "Show me all employees"
- "List all departments with employee counts"

## Integration Pattern

This module follows the standard HRM module pattern:

```typescript
// controller.ts - All route handlers
export class SimpleMCPController {
  static getOAuthToken = asyncHandler(async (req, res) => { ... });
  static handleRPC = asyncHandler(async (req, res) => { ... });
  static getHealth = asyncHandler(async (req, res) => { ... });
}

// router.ts - Route definitions
const router = Router();
router.post('/oauth/token', SimpleMCPController.getOAuthToken);
router.post('/rpc', authenticateToken, SimpleMCPController.handleRPC);
router.get('/health', SimpleMCPController.getHealth);

// defaultRoutes.ts - Route registration
import SimpleMCPRoutes from '../../simple-mcp-server/router';
{ path: '/simple-mcp', tags: ['api', 'Simple MCP'], routes: SimpleMCPRoutes }
```

## Validation

Tool arguments are validated using Zod schemas that extend existing HRM validators:

```typescript
// schemas.ts
export const SearchEmployeesSchema = employeeQueryValidator.extend({
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const GetDepartmentsSchema = departmentQueryValidator.extend({
  includeEmployeeCount: z.boolean().optional().default(true),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});
```

## Real Database Integration

This module uses real HRM service functions instead of mock data:

```typescript
// toolExecutor.ts
import { fetchEmployeeList } from '../modules/employee/service';
import { fetchDepartmentList } from '../modules/department/service';

case 'search_employees': {
  const validatedArgs = SearchEmployeesSchema.parse(args);
  const result = await fetchEmployeeList({
    page: validatedArgs.page || 0,
    pageSize: validatedArgs.pageSize || 20,
  });
  return createToolResponse({ ...result, meta: { ...result.meta, timestamp: new Date().toISOString() } });
}
```

## API Reference

### POST /simple-mcp/oauth/token

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

### POST /simple-mcp/rpc

JSON-RPC 2.0 endpoint.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_employees",
    "arguments": {
      "page": 0,
      "pageSize": 20
    }
  }
}
```

**Methods:**

- `initialize` - Initialize connection
- `tools/list` - List all tools
- `tools/call` - Execute a tool
- `prompts/list` - List prompts (empty)

### GET /simple-mcp/health

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

## Comparison with Full MCP Server

| Feature            | Full MCP                  | Simple MCP                |
| ------------------ | ------------------------- | ------------------------- |
| **Files**          | 15+ files                 | 6 core files              |
| **Tools**          | 16+ tools                 | 2 tools                   |
| **Database**       | PostgreSQL + Sequelize    | PostgreSQL + Sequelize    |
| **Routes**         | Multiple endpoints        | RPC only                  |
| **Integration**    | Main app routes           | Main app routes           |
| **File Structure** | Controller/Router pattern | Controller/Router pattern |
| **OAuth Flow**     | Advanced (PKCE)           | Simple client_credentials |
| **Validation**     | Zod schemas               | Zod schemas               |

## Troubleshooting

### Routes not working

1. Ensure main HRM app is running
2. Check that routes are registered in `defaultRoutes.ts`
3. Verify imports are correct

### Claude Desktop not connecting

1. Ensure main HRM app is running
2. Build stdio-proxy: `npm run build`
3. Check REMOTE_MCP_URL in config points to `http://localhost:3000/simple-mcp`
4. Restart Claude Desktop
5. Check MCP logs in Claude Desktop

### Authentication errors

- Verify client_id and client_secret match in controller.ts:17-18
- Check JWT_SECRET environment variable

## Development

To make changes to this module:

1. Edit files in `src/simple-mcp-server/`
2. Main app will auto-reload (if using `npm run dev`)
3. For STDIO proxy changes, rebuild: `npm run build` in simple-mcp-server directory

## Learn More

- Compare with full implementation: `../modules/mcp-server/`
- Full documentation: `../../MCP_ARCHITECTURE_DOCUMENTATION.md`
- MCP Specification: https://modelcontextprotocol.io/

## License

MIT
